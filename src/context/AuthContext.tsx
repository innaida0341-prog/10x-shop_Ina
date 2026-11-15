import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { GUEST } from "@/types/user";
import type { AuthUser, ProfilePatch } from "@/types/user";

interface AuthContextValue {
  user: AuthUser;
  isLoggedIn: boolean;
  login: (username: string) => void;
  logout: () => void;
  updateProfile: (patch: ProfilePatch) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): ReactElement {
  const [user, setUser] = useState<AuthUser>(GUEST);

  const login = useCallback((username: string): void => {
    const clean = username.trim();
    setUser({ ...GUEST, username: clean, firstName: clean, isLoggedIn: true });
  }, []);

  const logout = useCallback((): void => setUser(GUEST), []);

  const updateProfile = useCallback((patch: ProfilePatch): void => {
    setUser((current) => ({ ...current, ...patch }));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoggedIn: user.isLoggedIn, login, logout, updateProfile }),
    [user, login, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}