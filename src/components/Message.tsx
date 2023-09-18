import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { LoadingScreen } from "@/components/LoadingScreen";
import { useUsers } from "@/contexts/UsersContext";
import { useBlob } from '@/hooks/useBlob';
import { Message as MessageType } from "@/types/message";
import nonameIcon from "@/images/noname.png";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Tokyo');

export const Message = ({ message }: { message: MessageType }) => {
  const { usersById, loading } = useUsers();
  const sender = usersById[message.senderId];
  const { url } = useBlob(message.imagePath);

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div>
      <div>
        <img src={sender?.photoUrl || nonameIcon} />
        <span>{sender?.name || "名無しさん"}</span>
        <span>{dayjs.unix(message.createdAt.seconds).tz().format("YYYY-MM-DD hh:mm")}</span>
      </div>
      <p>{message.content}</p>
      {url && <img alt='message-image' src={url} />}
    </div>
  );
};
