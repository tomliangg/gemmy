import { useEffect, useState } from "react";
import {
  Content,
  GoogleGenerativeAI,
  POSSIBLE_ROLES,
} from "@google/generative-ai";
import { ChatMessageList } from "./ChatMessageList";
import { generationConfig, safetySettings } from "./constants";
import { ChatMessageProps } from "./ChatMessage";
import { ComposeInput } from "./ComposeInput";
import { retry, getPreferredScheme } from "./utils";
import styles from "./App.module.scss";

const genAI = new GoogleGenerativeAI("<API_KEY>");

interface Part extends ChatMessageProps {
  role: (typeof POSSIBLE_ROLES)[number];
}

export const App = () => {
  useEffect(() => {
    const theme = getPreferredScheme();
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (query: string) => {
    let updatedParts: Part[] = [
      ...parts,
      {
        role: "user",
        message: query,
        timestamp: new Date(),
        sender: "me",
      },
    ];

    setParts(updatedParts);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings,
      generationConfig,
    });

    const payloadContents: Content[] = updatedParts.map((part) => ({
      role: part.role,
      parts: [{ text: part.message }],
    }));

    try {
      setIsLoading(true);
      const modelOutputText = await retry(() =>
        model.generateContent({ contents: payloadContents })
      );
      updatedParts = [
        ...updatedParts,
        {
          role: "model",
          message: modelOutputText,
          timestamp: new Date(),
          sender: "ai",
        },
      ];
      setParts(updatedParts);
      return true;
    } catch (err) {
      // remove the last sent messsage from chat
      setParts(updatedParts.slice(0, -1));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <ChatMessageList contents={parts} isLoading={isLoading} />
      <ComposeInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};
