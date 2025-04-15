"use client"
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "@/api/api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "@/constants/AuthConstants";
import { UserType } from "@/types/types";
import { parse } from "path";
import authApi from "@/api/authApi";
import { useRouter } from "next/navigation"; // tambahkan ini

const AuthContext = createContext<{
  login: (data: object) => void;
  logout: () => void;
  isAuthorized: boolean | null;
  isLoading: boolean;
  refreshToken: () => Promise<void>;
  userData: UserType | null;
}>({
  login: (data: object) => null,
  logout: () => null,
  isAuthorized: null,
  isLoading: false,
  refreshToken: async () => {},
  userData: null
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
      auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
          const res = await authApi().refreshAuth({ refresh: refreshToken })

          if (res?.status === 200) {
              localStorage.setItem(ACCESS_TOKEN, res.data.access);
              setIsAuthorized(true);
          } else {
              setIsAuthorized(false);
          }
      } catch (error) {
          console.error(error);
          setIsAuthorized(false);
      }
  };

  const auth = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const userData = localStorage.getItem("userData");
      let parsedUserData = null;
      if (userData) {
        try {
          parsedUserData = JSON.parse(userData);
        } catch (error) {
          console.warn("Failed to parse userData:", userData);
        }
      }
      if (!token) {
          setIsAuthorized(false);
          return;
      }
      const decoded = jwtDecode(token);
      const tokenExpiration = decoded?.exp;
      const now = Date.now() / 1000;
      if (tokenExpiration !== undefined && tokenExpiration < now) {
          await refreshToken();
      } else {
          setIsAuthorized(true);
          setUserData(parsedUserData);
      }
    } catch (error) {
      console.error("Error checking authentication...", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const login = async (data: object) => {
    setIsLoading(true);
    try {
      const res = await authApi().login(data);
      if (res.error) {
        throw new Error(res.error);
      } else {
        await localStorage.setItem(ACCESS_TOKEN, res.access);
        await localStorage.setItem(REFRESH_TOKEN, res.refresh);
        await localStorage.setItem("userData", JSON.stringify(res.user));
        setIsAuthorized(true);
        setUserData(res.user);
      }
    } catch(error) {
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  }

  const logout = async () => {
    localStorage.clear();
    setIsAuthorized(false);
    setUserData(null);
    router.push("/login");
  }

  return (
     <AuthContext.Provider value={{ isAuthorized, login, logout, refreshToken, userData, isLoading }}>
         {children}
     </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
