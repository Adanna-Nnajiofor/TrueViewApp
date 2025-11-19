"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth, db, googleProvider, facebookProvider } from "@/firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  userData: DocumentData | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUserData: (uid?: string) => Promise<DocumentData | null>;
  signupWithEmail: (
    email: string,
    password: string,
    name: string,
    role: "user" | "host"
  ) => Promise<User>;
  loginWithEmail: (
    email: string,
    password: string
  ) => Promise<DocumentData | null>;
  loginWithOAuth: (
    provider: "google" | "facebook"
  ) => Promise<DocumentData | null>;
  signupWithOAuth: (
    provider: "google" | "facebook",
    role: "user" | "host"
  ) => Promise<User>;
  saveUserToFirestore: (user: User, role: "user" | "host") => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
  refreshUserData: async () => null,
  signupWithEmail: async () => ({} as User),
  loginWithEmail: async () => null,
  loginWithOAuth: async () => null,
  signupWithOAuth: async () => ({} as User),
  saveUserToFirestore: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await refreshUserData(currentUser.uid);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Refresh user Firestore data
  const refreshUserData = async (
    uid?: string
  ): Promise<DocumentData | null> => {
    try {
      const userId = uid || user?.uid;
      if (!userId) return null;

      const userRef = doc(db, "users", userId);
      const snapshot = await getDoc(userRef);
      const data = snapshot.exists() ? snapshot.data() : null;

      setUserData(data);
      return data;
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return null;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const saveUserToFirestore = async (user: User, role: "user" | "host") => {
    try {
      const userRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          role,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // EMAIL SIGNUP
  const signupWithEmail = async (
    email: string,
    password: string,
    name: string,
    role: "user" | "host"
  ): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const newUser = userCredential.user;

    await setDoc(doc(db, "users", newUser.uid), {
      uid: newUser.uid,
      email,
      displayName: name,
      role,
      createdAt: serverTimestamp(),
    });

    setUser(newUser);
    await refreshUserData(newUser.uid);

    return newUser;
  };

  // EMAIL LOGIN
  const loginWithEmail = async (
    email: string,
    password: string
  ): Promise<DocumentData | null> => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const loggedInUser = userCredential.user;

    setUser(loggedInUser);
    return await refreshUserData(loggedInUser.uid);
  };

  // OAUTH LOGIN (AUTO ROLE DETECTION)
  const loginWithOAuth = async (
    provider: "google" | "facebook"
  ): Promise<DocumentData | null> => {
    const result =
      provider === "google"
        ? await signInWithPopup(auth, googleProvider as GoogleAuthProvider)
        : await signInWithPopup(auth, facebookProvider as FacebookAuthProvider);

    const oauthUser = result.user;

    const userRef = doc(db, "users", oauthUser.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      // First time OAuth → default role "user"
      await setDoc(userRef, {
        uid: oauthUser.uid,
        email: oauthUser.email || "",
        displayName: oauthUser.displayName || "",
        photoURL: oauthUser.photoURL || "",
        role: "user",
        createdAt: serverTimestamp(),
      });
    }

    setUser(oauthUser);
    return await refreshUserData(oauthUser.uid);
  };

  // OAUTH SIGNUP (role chosen)
  const signupWithOAuth = async (
    provider: "google" | "facebook",
    role: "user" | "host"
  ): Promise<User> => {
    const result =
      provider === "google"
        ? await signInWithPopup(auth, googleProvider as GoogleAuthProvider)
        : await signInWithPopup(auth, facebookProvider as FacebookAuthProvider);

    const oauthUser = result.user;

    await saveUserToFirestore(oauthUser, role);

    setUser(oauthUser);
    await refreshUserData(oauthUser.uid);

    return oauthUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        logout,
        refreshUserData,
        signupWithEmail,
        loginWithEmail,
        loginWithOAuth,
        signupWithOAuth,
        saveUserToFirestore,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
