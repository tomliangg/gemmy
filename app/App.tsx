import { Toaster } from "react-hot-toast";
import { ChatMessageList } from "./ChatMessageList";
import { ComposeInput } from "./ComposeInput";
import styles from "./App.module.scss";
import { useSetup } from "./useSetup";

export const App = () => {
  const { isLoading, handleSubmit, parts } = useSetup();

  return (
    <div className={styles.container}>
      <Toaster toastOptions={{ className: styles.toast }} />
      <ChatMessageList contents={parts} isLoading={isLoading} />
      <ComposeInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};
