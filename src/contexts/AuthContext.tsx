import { createContext, ReactNode, useCallback, useContext } from "react";

import { useAuthState } from "@/hooks/useAuthState";
import { signInGoogleWithPopup, signOut, User } from "@/lib/firebase";
import { getUser, addUser } from "@/lib/user";

type AuthContextValue = {
  currentUser?: User | null;
};

export const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser] = useAuthState();

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { currentUser } = useContext(AuthContext);
  const signInWithGoogle = useCallback(async () => {
    try {
      const { user } = await signInGoogleWithPopup();
      const { isExist } = await getUser(user.uid);
      if (!isExist) {
        await addUser(user);
      }
    } catch (e) {
      console.error(e);
      await signOut();
    }
  }, []);
  return { currentUser, signInWithGoogle, signOut };
};
