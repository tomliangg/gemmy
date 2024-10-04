<script lang="ts">
  import { Marked } from "marked";
  import { markedHighlight } from "marked-highlight";
  import prism from "prismjs";
  import { cx } from "@emotion/css";
  import styles from "./ChatMessage.module.scss";
  import Badge from "./Badge.svelte";
  import Bouncer from "./Bouncer.svelte";
    import Pill from "./Pill.svelte";

  export let message: string;
  export let timestamp: Date;
  export let sender: "me" | "ai";
  export let isLoading: boolean = false;
  export let files: File[] | undefined = undefined;

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
    }),
  );

  $: parsedMessage = marked.parse(message);
</script>

<div
  class={cx(
    styles.chatMessage,
    styles[`message-from-${sender}`],
    "chat-message",
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
    {#if files && files.length > 0}
      <div class={styles.pillsContainer}>
        {#each Array.from(files) as uploadedFile (uploadedFile.name)}
          <Pill
            name={uploadedFile.name}
          />
        {/each}
      </div>
    {/if}
    {@html parsedMessage}
  </div>
</div>
