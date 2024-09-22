import { ChatMessageProps, ChatMessage } from "./ChatMessage";
import styles from "./ChatMessageList.module.scss";

export interface ChatMessageListProps {
  contents: ChatMessageProps[];
  streamingMessage?: string;
}

export const ChatMessageList = ({
  contents,
  streamingMessage,
}: ChatMessageListProps) => {
  return (
    <div className={styles.chatMessageList}>
      {contents.map((content, index) => (
        <ChatMessage
          key={index}
          message={content.message}
          timestamp={content.timestamp}
          sender={content.sender}
          isLoading={false}
        />
      ))}
      {streamingMessage ? <ChatMessage message={streamingMessage} sender="ai" timestamp={new Date()} isLoading={true} /> : null}
    </div>
  );
};
