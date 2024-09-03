import { useEffect, useState } from "react";
import { ChatMessageList } from "./ChatMessageList";
import { GoogleGenerativeAI, POSSIBLE_ROLES } from "@google/generative-ai";
import { ChatMessageProps } from "./ChatMessage";
import { ComposeInput } from "./ComposeInput";

const genAI = new GoogleGenerativeAI("<API_KEY>");

interface Part extends ChatMessageProps {
  role: (typeof POSSIBLE_ROLES)[number];
}

export const App = () => {
  useEffect(() => {
    const run = async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("Explain how AI works");
      model.startChat;
      console.log(result.response.text());
    };
    // testing; use a false condition to skip
    if (1 + 1 > 3) {
      run();
    }
  }, []);
  const [parts, setParts] = useState<Part[]>([]);

  return (
    <>
      <ComposeInput
        onSubmit={(query) => {
          setParts([
            ...parts,
            {
              role: "user",
              message: query,
              timestamp: new Date(),
              sender: "me",
            },
          ]);
        }}
      />
      <ChatMessageList contents={parts} />
    </>
  );
};
