import { useState } from "react";

export interface UserSession {
  email: string;
  role: string;
  system: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
  system: string;
}

export function useAuth() {
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  const login = (credentials: LoginCredentials) => {
    setUserSession({
      email: credentials.email,
      role: credentials.role,
      system: credentials.system
    });

    // Show success notification
    import("sonner@2.0.3").then(({ toast }) => {
      toast.success(`Welcome to ${credentials.system.toUpperCase()}! Signed in as ${credentials.role}.`);
    });

    return credentials.system;
  };

  const logout = () => {
    const currentSystem = userSession?.system;
    setUserSession(null);
    
    // Show logout notification
    import("sonner@2.0.3").then(({ toast }) => {
      toast.success("Successfully signed out. Redirected to landing page.");
    });

    return currentSystem;
  };

  const isAuthenticated = !!userSession;

  return {
    userSession,
    login,
    logout,
    isAuthenticated
  };
}