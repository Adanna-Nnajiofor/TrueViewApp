// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "../context/AuthProvider";

// export default function HostPageWrapper({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user, userData, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading) {
//       if (!user || userData?.role !== "host") {
//         // Redirect non-hosts or unauthenticated users
//         router.push("/host/login");
//       }
//     }
//   }, [user, userData, loading, router]);

//   if (loading || !user || userData?.role !== "host") {
//     // Optional: Show a loading state while checking auth
//     return <p className="text-center mt-20">Checking authentication...</p>;
//   }

//   return <>{children}</>;
// }
