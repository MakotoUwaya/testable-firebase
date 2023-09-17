import { LoadingScreen } from "@/components/LoadingScreen";
import { useCollectionData } from "@/hooks/useCollectionData";
import { messagesQuery } from "@/lib/message";
import { Message } from "@/components/Message";

export const Messages = () => {
  const [massages, loading] = useCollectionData(messagesQuery());
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div>
      {massages?.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};
