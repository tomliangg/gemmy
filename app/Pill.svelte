<script lang="ts">
    import { SquareX } from "lucide-svelte";

    export let name: string;
    export let size: number | undefined = undefined;
    export let onDelete: VoidFunction | undefined = undefined;
</script>

<div class="pillContainer">
    <span class="name">{name}</span>
    {#if size !== undefined}
        <i class="size">({size} bytes)</i>
    {/if}
    {#if onDelete !== undefined}
        <button class="deleteButton" title="remove file" on:click={onDelete}
            ><SquareX size={16} /></button
        >
    {/if}
</div>

<style lang="scss">
    .pillContainer {
        display: inline-flex;
        padding: 6px 9px;
        align-items: center;
        gap: 9px;
        border-radius: 12px;
        background-color: var(--bg-primary-color);
    }

    .size {
        opacity: 0.7;
    }

    .deleteButton {
        background: none;
        outline: none;
        border: none;
        cursor: pointer;
        padding: 3px;
        height: 22px;
        width: 22px;
        box-sizing: border-box;

        &:hover {
            background-color: var(--button-bg);
        }
    }
</style>
