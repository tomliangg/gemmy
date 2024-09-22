import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { cx } from "@emotion/css";
import styles from "./ChatMessage.module.scss";
import Badge from "./Badge";
import Bouncer from "./Bouncer";

export interface ChatMessageProps {
  message: string;
  timestamp: Date;
  sender: "me" | "ai";
  isLoading?: boolean;
}

export const ChatMessage = ({
  message,
  timestamp,
  sender,
  isLoading = false,
}: ChatMessageProps) => {
  return (
    <div
      className={cx(styles["chat-message"], styles[`message-from-${sender}`])}
    >
      <div className={styles["message-header"]}>
        <div className={styles["badge-container"]}>
          <Badge name={sender} />
          {isLoading && <Bouncer />}
        </div>
        <span className={styles.timestamp}>
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className={cx(styles["message-content"], "message-content")}>
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight]}
          remarkPlugins={[remarkGfm]}
        >
          {message}
        </ReactMarkdown>
      </div>
    </div>
  );
};
