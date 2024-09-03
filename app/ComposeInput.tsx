import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import styles from "./ComposeInput.module.scss";

interface ComposeInputProps {
  onSubmit: (query: string) => void;
}

export const ComposeInput = ({ onSubmit }: ComposeInputProps) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(query);
    // Add your submit logic here
    console.log("Submitting message:", query);
    setQuery("");
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputContainer}>
          <textarea
            ref={textareaRef}
            value={query}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className={styles.input}
          />
        </div>
        <div className={styles.buttonsContainer}>
          <button
            type="submit"
            disabled={!query.trim()}
            className={`${styles.button} ${styles.sendButton}`}
            title="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};
