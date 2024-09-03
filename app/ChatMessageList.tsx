import { ChatMessageProps, ChatMessage } from "./ChatMessage";
import styles from "./ChatMessageList.module.scss";
import "highlight.js/styles/github.css";

export interface ChatMessageListProps {
  contents: ChatMessageProps[];
}

export const ChatMessageList = ({ contents }: ChatMessageListProps) => {
  return (
    <div className={styles.chatMessageList}>
      {contents.map((content, index) => (
        <ChatMessage
          key={index}
          message={content.message}
          timestamp={content.timestamp}
          sender={content.sender}
        />
      ))}
    </div>
  );
};
