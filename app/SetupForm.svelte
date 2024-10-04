<script lang="ts">
  import { getVscode } from "./utils";

  interface GeminiConfig {
    apiKey: string;
    modelName: string;
  }

  export let config: GeminiConfig;
  let newApiKey = "";

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const vscode = getVscode();
    vscode.postMessage({
      type: "setApiKey",
      value: newApiKey,
    });
    config = {
      ...config,
      apiKey: newApiKey,
    };
  };
</script>

<form on:submit={handleSubmit} class="form">
  <label for="apiKey">Enter Gemini API Key:</label>
  <input type="text" id="apiKey" bind:value={newApiKey} />
  <button
    class="submitButton"
    disabled={newApiKey.trim().length < 6}
    type="submit"
  >
    Submit
  </button>
</form>

<style lang="scss">
  .submitButton {
    padding: 0.5rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s;
    border: none;
    background-color: #3b82f6;
    color: var(--text-primary-color);

    &:hover {
      background-color: #2563eb;
    }

    &:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }
  }

  .form {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    padding: 12px;

    input {
      height: 35px;
      margin-bottom: 6px;
    }
  }
</style>
