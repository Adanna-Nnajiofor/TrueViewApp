"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// Define context type
interface AuthContextType {
  user: User | null;
  userData: any; // Firestore profile data
  loading: boolean;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
  refreshUserData: async () => {},
});

// Hook for consuming context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const snapshot = await getDoc(userRef);
          setUserData(snapshot.exists() ? snapshot.data() : {});
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData({});
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Refresh Firestore user data
  const refreshUserData = async () => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);
        setUserData(snapshot.exists() ? snapshot.data() : {});
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, userData, loading, logout, refreshUserData }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
