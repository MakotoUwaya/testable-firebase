import { LoadingScreen } from "@/components/LoadingScreen";
import { useUsers } from "@/contexts/UsersContext";
import { Message as MessageType } from "@/types/message";
import nonameIcon from "@/images/noname.png";

export const Message = ({ message }: { message: MessageType }) => {
  const { usersById, loading } = useUsers();
  const sender = usersById[message.senderId];

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div>
      <div>
        <img src={sender?.photoUrl || nonameIcon} />
        <span>{sender?.name || "名無しさん"}</span>
        <span>{message.createdAt.toDate().toLocaleString("ja-JP")}</span>
      </div>
      <p>{message.content}</p>
    </div>
  );
};
