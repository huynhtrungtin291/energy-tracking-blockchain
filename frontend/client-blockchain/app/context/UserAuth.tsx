"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface IJwtPayload {
  username?: string;
  name?: string; // Full name
  role?: "admin" | "user" | "all";
  exp?: number; // Expiration time (timestamp)
}

interface IUserAuth {
  username: string;
  name: string;
  token: string;
  role: "admin" | "user" | "all";
  exp?: number;
}

interface IAuthContext {
  userAuth: IUserAuth | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}

const AuthContext = createContext<IAuthContext>({
  userAuth: null,
  isAuthenticated: false,
  isAuthLoading: true,
});

export const UserAuthWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userAuth, setUserAuth] = useState<IUserAuth | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Chỉ chạy trên client
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("auth_token");

    console.log("useAuth get token:", token);

    if (!token) {
      setUserAuth(null);
      setIsAuthLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<IJwtPayload>(token);

      // Kiểm tra hết hạn
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("auth_token");
        setUserAuth(null);
        setIsAuthLoading(false);
        return;
      }

      setUserAuth({
        username: decoded.username || "unknown",
        name: decoded.name || "unknown",
        role:
          (decoded.role?.toLowerCase() as "admin" | "user" | "all") || "user",
        exp: decoded.exp,
        token,
      });

      console.log("Decoded JWT payload:", decoded);
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("auth_token");
      setUserAuth(null);
    } finally {
      setIsAuthLoading(false);
    }
  }, []); // Chỉ chạy 1 lần khi mount

  const value = useMemo(
    () => ({
      userAuth,
      isAuthenticated: !!userAuth,
      isAuthLoading: isAuthLoading,
    }),
    [userAuth, isAuthLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
