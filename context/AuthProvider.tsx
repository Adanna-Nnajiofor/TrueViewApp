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
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// Context type
interface AuthContextType {
  user: User | null;
  userData: any;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUserData: (uid?: string) => Promise<void>;
  signupWithEmail: (
    email: string,
    password: string,
    name: string,
    role: "user" | "host"
  ) => Promise<User>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithOAuth: (
    provider: "google" | "facebook",
    role: "user" | "host"
  ) => Promise<void>;
  signupWithOAuth: (
    provider: "google" | "facebook",
    role: "user" | "host"
  ) => Promise<User>;
  saveUserToFirestore: (user: User, role: "user" | "host") => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
  refreshUserData: async () => {},
  signupWithEmail: async () => ({} as User),
  loginWithEmail: async () => {},
  loginWithOAuth: async () => {},
  signupWithOAuth: async () => ({} as User),
  saveUserToFirestore: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
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

  // Refresh Firestore user data
  const refreshUserData = async (uid?: string) => {
    try {
      const userId = uid || user?.uid;
      if (!userId) return;

      const userRef = doc(db, "users", userId);
      const snapshot = await getDoc(userRef);
      setUserData(snapshot.exists() ? snapshot.data() : null);
    } catch (error) {
      console.error("Error refreshing user data:", error);
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
      console.error("Error saving user to Firestore:", error);
    }
  };

  // Email/password signup
  const signupWithEmail = async (
    email: string,
    password: string,
    name: string,
    role: "user" | "host"
  ) => {
    try {
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
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Email/password login
  const loginWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const loggedInUser = userCredential.user;
      setUser(loggedInUser);
      await refreshUserData(loggedInUser.uid);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // OAuth login (Google/Facebook)
  const loginWithOAuth = async (
    provider: "google" | "facebook",
    role: "user" | "host"
  ) => {
    try {
      let result;
      if (provider === "google") {
        result = await signInWithPopup(
          auth,
          googleProvider as GoogleAuthProvider
        );
      } else {
        result = await signInWithPopup(
          auth,
          facebookProvider as FacebookAuthProvider
        );
      }

      const oauthUser = result.user;
      await saveUserToFirestore(oauthUser, role);
      setUser(oauthUser);
      await refreshUserData(oauthUser.uid);
    } catch (error) {
      console.error(`${provider} login error:`, error);
      throw error;
    }
  };

  // OAuth signup (Google/Facebook) – returns User
  const signupWithOAuth = async (
    provider: "google" | "facebook",
    role: "user" | "host"
  ) => {
    try {
      let result;
      if (provider === "google") {
        result = await signInWithPopup(
          auth,
          googleProvider as GoogleAuthProvider
        );
      } else {
        result = await signInWithPopup(
          auth,
          facebookProvider as FacebookAuthProvider
        );
      }

      const oauthUser = result.user;
      await saveUserToFirestore(oauthUser, role);
      setUser(oauthUser);
      await refreshUserData(oauthUser.uid);
      return oauthUser;
    } catch (error) {
      console.error(`${provider} signup error:`, error);
      throw error;
    }
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
