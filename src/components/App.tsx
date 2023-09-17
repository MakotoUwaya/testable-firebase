import { Messages } from "@/components/Messages";
import { MessageForm } from "@/components/MessageForm";
import { useAuth } from "@/contexts/AuthContext";

export const App = () => {
  const { signOut } = useAuth();

  return (
    <div>
      <h1>Sample Chat App</h1>
      <div>
        <button onClick={signOut}>ログアウト</button>
      </div>
      <div>
          <Messages />
          <MessageForm />
      </div>
    </div>
  );
};
