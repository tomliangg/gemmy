import { useState, useRef, useEffect } from "react";
import { Send, Loader, Trash2 } from "lucide-react";
import styles from "./ComposeInput.module.scss";
import { Part } from "./useSetup";

interface ComposeInputProps {
  onSubmit: (query: string) => Promise<boolean>;
  isLoading: boolean;
  parts: Part[];
  setParts: (udpatedParts: Part[]) => void;
}

export const ComposeInput = ({ onSubmit, isLoading, parts, setParts }: ComposeInputProps) => {
  const [query, setQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [query]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 600)}px`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const submitHandler = async () => {
    const queryCopy = query; // save a copy; will be useful in failure case.
    setQuery("");

    const submitSuccessful = await onSubmit(query);

    if (!submitSuccessful) {
      // in case of failure, reset the query to the original value
      setQuery(queryCopy);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitHandler();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitHandler();
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputContainer}>
          <textarea
            ref={textareaRef}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isLoading ? "Generating a response..." : "Type your message..."
            }
            className={styles.input}
            disabled={isLoading}
          />
        </div>
        <div className={styles.buttonsContainer}>
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={`${styles.button} ${styles.sendButton}`}
            title="Send message"
          >
            {isLoading ? <Loader size={16} /> : <Send size={16} />}
          </button>
          {!isLoading && parts.length && !query ? <button
            type="button"
            className={`${styles.button} ${styles.clearButton}`}
            title="Clear all messages"
            onClick={() => {
              setParts([]);
            }}
          >
            <Trash2 size={16} />
          </button> : null}
        </div>
      </form>
    </div>
  );
};
