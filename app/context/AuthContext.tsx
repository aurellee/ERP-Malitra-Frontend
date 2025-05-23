"use client";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import authApi from "@/api/authApi";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "@/constants/AuthConstants";
import { UserType } from "@/types/types";

type AuthContextType = {
  user: UserType | null;
  register: (data: object) => Promise<void>;
  login: (data: object) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isLoading: true
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    const access = localStorage.getItem(ACCESS_TOKEN);
    const refresh = localStorage.getItem(REFRESH_TOKEN);
    if (!access || !refresh) {
      logout();
      setIsLoading(false);
      return;
    }

    try {
      if (!access || access.split(".").length !== 3) {
        console.warn("Access token invalid or malformed:", access);
        logout();
      }
      const decoded: any = jwtDecode(access);
      const expired = decoded.exp * 1000 < Date.now();

      if (expired) {
        const res = await authApi().refreshAuth({ refresh });
        if (!res.data?.access) logout();

        localStorage.setItem(ACCESS_TOKEN, res.data.access);
      }

      const userData = localStorage.getItem("userData");
      setUser(userData ? JSON.parse(userData) : null);
      setIsAuthenticated(true);
    } catch (err) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (data: object) => {
    setIsLoading(true);
    try {
      const res = await authApi().login(data);

      if (!res || !res.access || !res.refresh || !res.user) {
        throw new Error("Invalid credentials");
      }

      localStorage.setItem(ACCESS_TOKEN, res.access);
      localStorage.setItem(REFRESH_TOKEN, res.refresh);
      const userObj: UserType = {
        userId:   res.user.id,
        userName: res.user.username,
        email:    res.user.email,
      };

      localStorage.setItem("userData", JSON.stringify(userObj));

      setUser(userObj);
      setIsAuthenticated(true);

      router.push("/");
    } catch (error) {
      setIsAuthenticated(false);
      
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      localStorage.removeItem("userData");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: object) => {
    setIsLoading(true);
    try {
      const res = await authApi().register(data);
      console.log("res", res);
      if (res) {
        router.push("/login");
      } else {
        throw new Error(res.error);
      }
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    // router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);