import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { CSSProperties } from 'react';

import { LoadingScreen } from "@/components/LoadingScreen";
import { useUsers } from "@/contexts/UsersContext";
import { useBlob } from '@/hooks/useBlob';
import { Message as MessageType } from "@/types/message";
import nonameIcon from "@/images/noname.png";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Tokyo');

const userProfileStyle: CSSProperties = {
  display: "flex",
  marginTop: "8px",
};

const senderImageStyle: CSSProperties = {
  height: "40px",
  width: "40px",
  borderRadius: "50%",
  objectFit: "cover",
};

const senderInfoStyle: CSSProperties = {
  marginLeft: "4px",
  display: "flex",
  flexDirection: "column",
};

const messageTextStyle: CSSProperties = {
  padding: "4px",
  backgroundColor: "#f1f2f6",
  borderRadius: "4px",
};

const messageImageStyle: CSSProperties = {
  maxWidth: "300px",
  width: "100%",
  cursor: "pointer",
};

export const Message = ({ message }: { message: MessageType }) => {
  const { usersById, loading } = useUsers();
  const sender = usersById[message.senderId];
  const { url } = useBlob(message.imagePath);

  const onClickImage = () => {
    if (!url) {
      return;
    }
    window.open(url, "_blank", "noreferrer");
  };

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div>
      <div style={userProfileStyle}>
        <img style={senderImageStyle} src={sender?.photoUrl || nonameIcon} />
        <div style={senderInfoStyle}>
          <span>{sender?.name || "名無しさん"}</span>
          <span>{dayjs.unix(message.createdAt.seconds).tz().format("YYYY-MM-DD hh:mm")}</span>
        </div>
      </div>
      <div style={messageTextStyle}>{message.content}</div>
      {url && <img style={messageImageStyle} alt='message-image' src={url} onClick={onClickImage} />}
    </div>
  );
};
