import { useState } from "react";
import styles from "./SetupForm.module.scss";
import { GeminiConfig } from "./useSetup";
import { getVscode } from "./utils";

interface SetupFormProps {
  setConfig: React.Dispatch<React.SetStateAction<GeminiConfig>>;
}

export const SetupForm = ({ setConfig }: SetupFormProps) => {
  const [newApiKey, setNewApiKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vscode = getVscode();
    vscode.postMessage({
      type: "setApiKey",
      value: newApiKey,
    });
    setConfig((prev) => ({
      ...prev,
      apiKey: newApiKey,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="apiKey">Enter Gemini API Key:</label>
      <input
        type="text"
        id="apiKey"
        value={newApiKey}
        onChange={(e) => setNewApiKey(e.target.value)}
      />
      <button
        className={styles.submitButton}
        disabled={newApiKey.trim().length < 6}
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};
