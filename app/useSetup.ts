import {
  Content,
  GoogleGenerativeAI,
  POSSIBLE_ROLES,
} from "@google/generative-ai";
import { useEffect, useMemo, useState } from "react";
import { getPreferredScheme, retry } from "./utils";
import { generationConfig, safetySettings } from "./constants";
import { ChatMessageProps } from "./ChatMessage";
import toast from "react-hot-toast";

export interface Part extends ChatMessageProps {
  role: (typeof POSSIBLE_ROLES)[number];
}

export const useSetup = () => {
  const [apiKey, setApiKey] = useState("");
  const [modelName, setModelName] = useState("gemini-1.5-flash"); // must give it an initial value; otherwise can't initiate a model
  const genAI = useMemo(() => new GoogleGenerativeAI(apiKey), [apiKey]);
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.addEventListener("message", (e: MessageEvent) => {
      // Object containing type prop and value prop
      const msg: MessageEvent = e;

      switch (msg.data.type) {
        case "initializeConfiguration": {
          setApiKey(msg.data.value.apiKey as string);
          setModelName(msg.data.value.modelName as string);
          break;
        }
      }
    });
  }, []);

  useEffect(() => {
    const theme = getPreferredScheme();
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  const model = genAI.getGenerativeModel({
    model: modelName,
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
      toast.error(err?.toString() ?? "Something went wrong. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    parts,
    isLoading,
    handleSubmit,
  };
};
