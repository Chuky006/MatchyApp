import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "mentor" | "mentee";
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);