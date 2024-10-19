<script lang="ts">
  import { Send, Loader, Trash2, Upload, Info } from "lucide-svelte";
  import type { POSSIBLE_ROLES } from "@google/generative-ai";
  import { cx } from "@emotion/css";
  import { onMount, onDestroy, afterUpdate, type ComponentProps } from "svelte";
  import ChatMessage from "./ChatMessage.svelte";
  import styles from "./ComposeInput.module.scss";
  import Pill from "./Pill.svelte";

  interface Part extends ComponentProps<ChatMessage> {
    role: (typeof POSSIBLE_ROLES)[number];
  }

  export let onSubmit: (query: string, files: File[]) => Promise<boolean>;
  export let isLoading: boolean;
  export let parts: Part[];

  let query = "";

  // https://firebase.google.com/docs/vertex-ai/input-file-requirements
  // it only support certain types of files: images, video, audio, documents (like PDFs)
  let files: File[] = [];

  let textarea: HTMLTextAreaElement;
  let fileInput: HTMLInputElement;

  onMount(() => {
    window.addEventListener("resize", adjustTextareaHeight);
  });

  onDestroy(() => {
    window.removeEventListener("resize", adjustTextareaHeight);
  });

  afterUpdate(() => {
    adjustTextareaHeight();
  });

  function adjustTextareaHeight() {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 600)}px`;
  }

  async function submitHandler() {
    const queryCopy = query;
    const filesCopy = structuredClone(files);

    query = "";
    files = [];

    const submitSuccessful = await onSubmit(queryCopy, filesCopy);

    if (!submitSuccessful) {
      query = queryCopy;
      files = filesCopy;
    }

    textarea.focus();
  }

  $: canSubmit = query.trim().length > 0 && !isLoading;

  function handleFileUpload(e: Event) {
    e.preventDefault();
    files = [...files, ...(fileInput.files ?? [])];
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
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
  {#if files.length}
    <div class={styles.manageFilesContainer}>
      <h3>Selected files:</h3>
      <div class={styles.pillsContainer}>
        {#each files as uploadedFile (uploadedFile.name)}
          <Pill
            name={uploadedFile.name}
            size={uploadedFile.size}
            onDelete={() => {
              files = files.filter((f) => f.name !== uploadedFile.name);
            }}
          />
        {/each}
      </div>
      <div class={styles.infoText}>
        <Info size={14} /><i
          >&nbsp;Files are processed directly on your device as inline data and
          not saved to any storage. Please ensure file names are unique. Note
          that some file formats may be incompatible with Gemini.</i
        >
      </div>
    </div>
  {/if}
  <form on:submit={handleSubmit} class={styles.form}>
    <div class={styles.inputContainer}>
      <textarea
        bind:this={textarea}
        bind:value={query}
        on:keydown={handleKeyDown}
        placeholder={isLoading
          ? "Generating a response..."
          : "Type your message..."}
        class={styles.input}
        disabled={isLoading}
      />
    </div>
    <div class={styles.buttonsContainer}>
      <div class={styles.fileUploadButtonContainer}>
        <label
          title="Upload files"
          class={cx(styles.button, styles.uploadFileButton)}
          for="files-input"><Upload size={16} /></label
        >
        <input
          bind:this={fileInput}
          id="files-input"
          on:change={handleFileUpload}
          multiple
          type="file"
        />
      </div>
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
