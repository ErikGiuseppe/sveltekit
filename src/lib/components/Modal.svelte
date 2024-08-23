<script lang="ts">
  export let isOpen: boolean = false;
  export let onClose: () => void = () => {};

  function handleClose() {
    onClose();
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-gray-900 opacity-50" on:click={handleClose}></div>

    <!-- Modal Content -->
    <div class="bg-white p-6 rounded-lg shadow-lg relative z-10 w-full max-w-md">
      <!-- Close Button -->
      <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700" on:click={handleClose} aria-label="Close">
        &times;
      </button>

      <!-- Modal Body -->
      <slot></slot>
    </div>
  </div>
{/if}


