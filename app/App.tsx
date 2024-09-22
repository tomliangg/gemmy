import { Toaster } from "react-hot-toast";
import { ChatMessageList } from "./ChatMessageList";
import { ComposeInput } from "./ComposeInput";
import styles from "./App.module.scss";
import { useSetup } from "./useSetup";
import { SetupForm } from "./SetupForm";

const isProd = import.meta.env.PROD;

export const App = () => {
  const { isLoading, handleSubmit, parts, config, setConfig, streamingMessage } = useSetup();

  if (isProd && !config.apiKey) {
    // in prod where it has vs code extension context, check whether API key is set.
    // If not set, display a UI to guide users to set API key.
    return <SetupForm setConfig={setConfig} />;
  }

  return (
    <div className={styles.container}>
      <Toaster toastOptions={{ className: styles.toast }} />
      <ChatMessageList contents={parts} streamingMessage={streamingMessage} />
      <ComposeInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};
