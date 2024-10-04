<script lang="ts">
  import { onMount, type ComponentProps } from "svelte";
  import toast, { Toaster } from "svelte-french-toast";
  import {
    GoogleGenerativeAI,
    type Content,
    type POSSIBLE_ROLES,
  } from "@google/generative-ai";
  import type { Part as GeminiPart } from "@google/generative-ai/server";
  import ComposeInput from "./ComposeInput.svelte";
  import {
    getPreferredScheme,
    getVscodeState,
    retry,
    setVscodeState,
    arrayBufferToBase64,
  } from "./utils";
  import ChatMessageList from "./ChatMessageList.svelte";
  import { generationConfig, safetySettings } from "./constants";
  import ChatMessage from "./ChatMessage.svelte";
  import SetupForm from "./SetupForm.svelte";

  interface Part extends ComponentProps<ChatMessage> {
    role: (typeof POSSIBLE_ROLES)[number];
    files?: File[];
  }

  interface GeminiConfig {
    apiKey: string;
    modelName: string;
  }

  const isDev = import.meta.env.DEV;
  const isProd = import.meta.env.PROD;

  const vscodeState = getVscodeState();
  const vscodeConfigApiKey = vscodeState?.apiKey || "";
  const vscodeConfigApiModelName = vscodeState?.modelName || "gemini-1.5-flash"; // must give an initial value to model; otherwise it errors out
  let parts: Part[] = [];
  let config: GeminiConfig = {
    apiKey: isDev ? import.meta.env.VITE_GEMINI_API_KEY : vscodeConfigApiKey,
    modelName: isDev
      ? import.meta.env.VITE_GEMINI_MODEL_NAME
      : vscodeConfigApiModelName,
  };
  let streamingMessage = "";
  let isLoading = false;

  $: genAI = new GoogleGenerativeAI(config.apiKey);
  $: model = genAI.getGenerativeModel({
    model: config.modelName,
    safetySettings,
    generationConfig,
  });

  onMount(() => {
    const theme = getPreferredScheme();
    document.documentElement.setAttribute("data-theme", theme);

    window.addEventListener("message", (msg: MessageEvent) => {
      setVscodeState(msg.data.value);
      config = msg.data.value;
    });
  });

  // https://ai.google.dev/api/caching#Content
  const generateContent = async () => {
    isLoading = true;

    const contentParts: Content[] = [];
    for (const part of parts) {
      const contentPart: GeminiPart[] = [{ text: part.message }];
      if (part.files) {
        for (const file of part.files) {
          const fileArrayBuffer = await file.arrayBuffer();
          contentPart.push(
            {
              text: `The following part has inline data. The attachment is known as ${file.name}`,
            },
            {
              inlineData: {
                mimeType: file.type,
                data: arrayBufferToBase64(fileArrayBuffer),
              },
            },
          );
        }
      }
      contentParts.push({
        role: part.role,
        parts: contentPart,
      });
    }
    const result = await model.generateContentStream({
      contents: contentParts,
    });

    let hasMessage = false;

    for await (const chunk of result.stream) {
      if (Boolean(chunk?.text())) {
        const chunkText = chunk.text();
        streamingMessage += chunkText;
        hasMessage = true;
      }
    }

    if (!hasMessage) {
      throw new Error("No content received from the stream");
    }

    // add that message into list
    parts = [
      ...parts,
      {
        role: "model",
        message: streamingMessage,
        timestamp: new Date(),
        sender: "ai",
      },
    ];
    return Promise.resolve("Model generation is complete!");
  };

  const handleSubmit = async (query: string, files: File[]) => {
    parts = [
      ...parts,
      {
        role: "user",
        message: query,
        timestamp: new Date(),
        sender: "me",
        files,
      },
    ];

    let isSuccessful = false;

    try {
      // often, gemini stream contains no message (bugs on their end); therefore, retry
      await retry(generateContent);
      isSuccessful = true;
    } catch (err) {
      const errorMessage =
        err?.toString() ?? "Something went wrong. Please try again.";
      console.error(errorMessage);
      toast.error(errorMessage);
      // remove the last sent messsage from chat
      parts = parts.slice(0, -1);
      isSuccessful = false;
    } finally {
      isLoading = false;
      // reset streaming message since it's completely loaded
      streamingMessage = "";
      return isSuccessful;
    }
  };
</script>

{#if isProd && !config.apiKey}
  <SetupForm bind:config />
{:else}
  <div class="container">
    <ChatMessageList
      isStreaming={isLoading}
      contents={parts}
      {streamingMessage}
    />
    <ComposeInput onSubmit={handleSubmit} {isLoading} bind:parts />
    <Toaster
      toastOptions={{
        className: "toast",
      }}
    />
  </div>
{/if}

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    padding: 16px 16px 0;
  }

  :global(.toast) {
    word-break: break-word;
  }
</style>
