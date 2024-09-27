<script lang="ts">
  import { Marked } from "marked";
  import { markedHighlight } from "marked-highlight";
  import prism from "prismjs";
  import { cx } from "@emotion/css";
  import styles from "./ChatMessage.module.scss";
  import Badge from "./Badge.svelte";
  import Bouncer from "./Bouncer.svelte";

  export let message: string;
  export let timestamp: Date;
  export let sender: "me" | "ai";
  export let isLoading: boolean = false;

  const marked = new Marked(
    markedHighlight({
      async: false,
      highlight(code, lang) {
        if (prism.languages[lang]) {
          return prism.highlight(code, prism.languages[lang], lang);
        } else {
          return code;
        }
      },
    })
  );

  $: parsedMessage = marked.parse(message);
</script>

<div
  class={cx(
    styles.chatMessage,
    styles[`message-from-${sender}`],
    "chat-message"
  )}
>
  <div class={styles.messageHeader}>
    <div class={styles.badgeContainer}>
      <Badge name={sender} />
      {#if isLoading}
        <Bouncer />
      {/if}
    </div>
    <span class={styles.timestamp}>
      {new Date(timestamp).toLocaleTimeString()}
    </span>
  </div>
  <div class={styles.messageContent}>
    {@html parsedMessage}
  </div>
</div>
