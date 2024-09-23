<script lang="ts">
  export let name: "me" | "ai";
</script>

<div class="badge {name}">
  {name}
</div>

<style lang="scss">
  .badge {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: white;
    color: darkgrey;
    font-weight: bold;
    font-size: 14px;
    text-transform: uppercase;
  }

  .me {
    border: 1px solid skyblue;
  }

  .ai {
    border: 1px solid goldenrod;
  }
</style>
