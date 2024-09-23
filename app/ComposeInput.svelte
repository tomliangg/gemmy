<script lang="ts">
  import { Send, Loader, Trash2 } from "lucide-svelte";
  import type { POSSIBLE_ROLES } from "@google/generative-ai";
  import { cx } from "@emotion/css";
  import type { ComponentProps } from "svelte";
  import ChatMessage from "./ChatMessage.svelte";
  import styles from "./ComposeInput.module.scss";

  interface Part extends ComponentProps<ChatMessage> {
    role: (typeof POSSIBLE_ROLES)[number];
  }

  export let onSubmit: (query: string) => Promise<boolean>;
  export let isLoading: boolean;
  export let parts: Part[];

  let query = "";
  let textarea: HTMLTextAreaElement;

  $: if (textarea) {
    adjustTextareaHeight();
  }

  function adjustTextareaHeight() {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 600)}px`;
  }

  function handleInputChange(e: Event) {
    query = (e.target as HTMLTextAreaElement).value;
  }

  async function submitHandler() {
    const queryCopy = query;
    query = "";

    const submitSuccessful = await onSubmit(queryCopy);

    if (!submitSuccessful) {
      query = queryCopy;
    }

    textarea.focus();
  }

  $: canSubmit = query.trim().length > 0 && !isLoading;

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitHandler();
    }
  }

  function handleSubmit(e: Event) {
    if (!canSubmit) {
      return;
    }
    e.preventDefault();
    submitHandler();
  }
</script>

<div class={styles.container}>
  <form on:submit={handleSubmit} class={styles.form}>
    <div class={styles.inputContainer}>
      <textarea
        bind:this={textarea}
        bind:value={query}
        on:input={handleInputChange}
        on:keydown={handleKeyDown}
        placeholder={isLoading
          ? "Generating a response..."
          : "Type your message..."}
        class={styles.input}
        disabled={isLoading}
      />
    </div>
    <div class={styles.buttonsContainer}>
      <button
        type="submit"
        disabled={!canSubmit}
        class={cx(styles.button, styles.sendButton)}
        title="Send message"
      >
        {#if isLoading}
          <Loader size={16} />
        {:else}
          <Send size={16} />
        {/if}
      </button>
      {#if !isLoading && parts.length && !query}
        <button
          type="button"
          class={cx(styles.button, styles.clearButton)}
          title="Clear all messages"
          on:click={() => {
            parts = [];
          }}
        >
          <Trash2 size={16} />
        </button>
      {/if}
    </div>
  </form>
</div>
