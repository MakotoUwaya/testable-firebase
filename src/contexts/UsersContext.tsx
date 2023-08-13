import { createContext, ReactNode, useContext, useMemo } from "react";

import { User } from "@/types/user";
import { useCollectionData } from "@/hooks/useCollectionData";
import { UsersRef } from "@/lib/user";

type UsersContextValue = {
  users: User[];
  usersById: { [id: string]: User };
  loading: boolean;
};

export const UsersContext = createContext<UsersContextValue>({
  users: [],
  usersById: {},
  loading: true,
});

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, loading] = useCollectionData<User>(UsersRef());
  const usersById = useMemo(() => {
    if (!users) {
      return {};
    }
    return users.reduce(
      (map, user) => Object.assign(map, { [user.id]: user }),
      {},
    );
  }, [users]);
  return (
    <UsersContext.Provider value={{ users: users || [], usersById, loading }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const { users, usersById, loading } = useContext(UsersContext);
  return { users, usersById, loading };
};
