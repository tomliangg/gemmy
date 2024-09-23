import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// temperature range is [0, 2.0]; use low temperature for logical problem (maths); use high temperature for creative problem (such as writing)
export const generationConfig = {
  temperature: 0.2,
};

// https://ai.google.dev/gemini-api/docs/safety-settings#node.js
export const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

interface ChatMessageTyp {
  message: string;
  timestamp: Date;
  sender: "me" | "ai";
  isLoading?: boolean;
}

// use for testing
export const chatMessages: ChatMessageTyp[] = [
  {
    message: "Hello, how are you?",
    timestamp: new Date("2023-05-01T10:30:00Z"),
    sender: "me",
  },
  {
    message: "I'm doing well, thanks for asking!",
    timestamp: new Date("2023-05-01T10:31:00Z"),
    sender: "ai",
  },
  {
    message:
      " Here's a JavaScript function to generate the n-th Fibonacci number:\n\n```javascript\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  \n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    let temp = a + b;\n    a = b;\n    b = temp;\n  }\n  \n  return b;\n}\n```\n\nThis function uses an iterative approach to calculate the n-th Fibonacci number. Here's how it works:\n\n1. If `n` is 0 or 1, it returns `n` directly, as these are the base cases for the Fibonacci sequence.\n2. For `n` >= 2, it uses two variables `a` and `b` to keep track of the previous two Fibonacci numbers.\n3. It then iterates from 2 to n, updating `a` and `b` in each iteration to generate the next Fibonacci number.\n4. Finally, it returns `b`, which will contain the n-th Fibonacci number.\n\nYou can use this function like this:\n\n```javascript\nconsole.log(fibonacci(0));  // 0\nconsole.log(fibonacci(1));  // 1\nconsole.log(fibonacci(5));  // 5\nconsole.log(fibonacci(10)); // 55\n```\n\nWould you like me to explain any part of this code in more detail?",
    timestamp: new Date("2023-05-01T10:32:00Z"),
    sender: "me",
  },
  {
    message: "I'm planning to go hiking with some friends. How about you?",
    timestamp: new Date("2023-05-01T10:33:00Z"),
    sender: "ai",
  },
  {
    message:
      "Sounds fun! I'm going to catch up on some reading and maybe watch a movie.",
    timestamp: new Date("2023-05-01T10:34:00Z"),
    sender: "me",
  },
  {
    message: "Hey, did you catch the game last night?",
    timestamp: new Date("2023-05-02T18:45:00Z"),
    sender: "ai",
  },
  {
    message: "No, I missed it. What happened?",
    timestamp: new Date("2023-05-02T18:47:00Z"),
    sender: "me",
  },
  {
    message: "It was a nail-biter! Our team won in overtime.",
    timestamp: new Date("2023-05-02T18:49:00Z"),
    sender: "ai",
  },
  {
    message: "Awesome! I'll have to catch the highlights.",
    timestamp: new Date("2023-05-02T18:51:00Z"),
    sender: "me",
  },
  {
    message: "By the way, have you started working on the new project yet?",
    timestamp: new Date("2023-05-02T18:53:00Z"),
    sender: "ai",
  },
  {
    message:
      "Not yet, I'm still finishing up the last one. I should be able to start it next week.",
    timestamp: new Date("2023-05-02T18:55:00Z"),
    sender: "me",
  },
  {
    message:
      "Sounds good. Let me know if you need any help or have any questions.",
    timestamp: new Date("2023-05-02T18:57:00Z"),
    sender: "ai",
  },
  {
    message: "Will do, thanks!",
    timestamp: new Date("2023-05-02T18:59:00Z"),
    sender: "me",
  },
  {
    isLoading: true,
    message: `
  # This is a header

This is a paragraph.

* This is a list
* With two items
  1. And a sublist
  2. That is ordered
    * With another
    * Sublist inside

| And this is | A table |
|-------------|---------|
| With two    | columns |`,
    timestamp: new Date("2023-05-02T18:59:00Z"),
    sender: "ai",
  },
];
