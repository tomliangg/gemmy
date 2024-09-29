<script lang="ts">
  import { afterUpdate, type ComponentProps } from "svelte";
  import ChatMessage from "./ChatMessage.svelte";

  export let contents: ComponentProps<ChatMessage>[];
  export let streamingMessage: string;
  export let isStreaming: boolean;
  let messageList: HTMLDivElement;

  afterUpdate(() => {
    // automatically scroll to the last User message and AI message
    if (contents.length) {
      const lastMessage = messageList.querySelector(
        ".chat-message:last-of-type"
      ) as HTMLDivElement;
      lastMessage.scrollIntoView(true);
    }
  });
</script>

<div class="chatMessageList" bind:this={messageList}>
  {#each contents as content}
    <ChatMessage
      message={content.message}
      timestamp={content.timestamp}
      sender={content.sender}
      isLoading={content.isLoading}
    />
  {/each}

  {#if isStreaming}
    <ChatMessage
      message={streamingMessage}
      sender="ai"
      timestamp={new Date()}
      isLoading={true}
    />
  {/if}
</div>

<style lang="scss">
  .chatMessageList {
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
  }
</style>
