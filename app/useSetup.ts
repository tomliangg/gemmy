import {
  Content,
  GoogleGenerativeAI,
  POSSIBLE_ROLES,
} from "@google/generative-ai";
import { useEffect, useMemo, useState } from "react";
import {
  getPreferredScheme,
  setVscodeState,
  getVscodeState,
} from "./utils";
import { generationConfig, safetySettings } from "./constants";
import { ChatMessageProps } from "./ChatMessage";
import toast from "react-hot-toast";

const vscodeState = getVscodeState();
const vscodeConfigApiKey = vscodeState?.apiKey || "";
const vscodeConfigApiModelName = vscodeState?.modelName || "gemini-1.5-flash"; // must give an initial value to model; otherwise it errors out

export interface Part extends ChatMessageProps {
  role: (typeof POSSIBLE_ROLES)[number];
}

export interface GeminiConfig {
  apiKey: string;
  modelName: string;
}

const isDev = import.meta.env.DEV;

export const useSetup = () => {
  const [config, setConfig] = useState<GeminiConfig>({
    apiKey: isDev ? import.meta.env.VITE_GEMINI_API_KEY : vscodeConfigApiKey,
    modelName: isDev
      ? import.meta.env.VITE_GEMINI_MODEL_NAME
      : vscodeConfigApiModelName,
  });
  const genAI = useMemo(
    () => new GoogleGenerativeAI(config.apiKey),
    [config.apiKey]
  );
  const [parts, setParts] = useState<Part[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const theme = getPreferredScheme();
    document.documentElement.setAttribute("data-theme", theme);

    window.addEventListener("message", (msg: MessageEvent) => {
      setVscodeState(msg.data.value);
      setConfig(msg.data.value);
    });
  }, []);

  const model = genAI.getGenerativeModel({
    model: config.modelName,
    safetySettings,
    generationConfig,
  });

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
    const payloadContents: Content[] = updatedParts.map((part) => ({
      role: part.role,
      parts: [{ text: part.message }],
    }));

    try {
      setIsLoading(true);
      const result = await model.generateContentStream({ contents: payloadContents });
      let responseText = '';
      setStreamingMessage(responseText);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        responseText += chunkText;
        setStreamingMessage(responseText);
      }

      // reset streaming message since it's completely loaded; add that message into list.
      setStreamingMessage(undefined);

      updatedParts = [
        ...updatedParts,
        {
          role: "model",
          message: responseText,
          timestamp: new Date(),
          sender: "ai",
        },
      ];
      setParts(updatedParts);
      return true;
    } catch (err) {
      // remove the last sent messsage from chat
      setParts(updatedParts.slice(0, -1));
      toast.error(err?.toString() ?? "Something went wrong. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    parts,
    setParts,
    isLoading,
    handleSubmit,
    config,
    setConfig,
    streamingMessage,
  };
};
