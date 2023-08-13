import type { User } from "firebase/auth";
import { createContext, ReactNode, useContext } from "react";

import { useAuthState } from "@/hooks/useAuthState";

type AuthContextValue = {
  currentUser?: User | null;
};

export const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
});

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [currentUser] = useAuthState();

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  )
};

export const useAuth = () => {
  const { currentUser } = useContext(AuthContext);
  return { currentUser };
};
