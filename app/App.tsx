import { ChatMessageList } from "./ChatMessageList";
import { chatMessages } from "./constants";

export const App = () => {
  return <ChatMessageList contents={chatMessages} />;
};
