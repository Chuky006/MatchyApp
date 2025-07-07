import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";
import axios from "axios";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // 👈 Add this

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        setUser(res.data);
        console.log("✅ Fetched user:", res.data);
      } catch (error) {
        setUser(null);
        console.log("No user found");
      } finally {
        setLoading(false); // 👈 Done fetching
      }
    };

    fetchCurrentUser();
  }, []);

  // 👇 Only render app after fetch is complete
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
