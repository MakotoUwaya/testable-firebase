import { useAuth } from "@/contexts/AuthContext";

export const App = () => {
  const { signOut } = useAuth();

  return (
    <div>
      <h1>Sample Chat App</h1>
      <div>
        <button onClick={signOut}>ログアウト</button>
      </div>
    </div>
  );
};
