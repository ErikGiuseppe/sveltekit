<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { challengeStore } from '../lib/stores/challenge';
  import Modal from '../lib/components/Modal.svelte';
  import { goto } from '$app/navigation';

  let name: string = '';
  let phone: string = '';
  let email: string = '';
  let interval: number | undefined;
  let showModal: boolean = false;
  let modalMessage: string = '';
  let hasFailed: boolean = false;

  // Subscribe to the store
  $: challengeState = $challengeStore;

  // Restore timer from localStorage if challenge has started
  onMount(() => {
    const savedState = localStorage.getItem('challengeState');
    if (savedState) {
      const state = JSON.parse(savedState);
      challengeStore.set(state);
      if (state.isChallengeStarted && state.timeLeft > 0) {
        startTimer(state.timeLeft);
      }
    }
  });

  function startChallenge() {
    hasFailed = false;

    const newState = {
      isChallengeStarted: true,
      timeLeft: 15,
      name,
      phone,
      email
    };
    challengeStore.set(newState);
    localStorage.setItem('challengeState', JSON.stringify(newState));
    startTimer(newState.timeLeft);
  }

  function startTimer(timeLeft: number) {
    interval = window.setInterval(() => {
      challengeStore.update(state => {
        if (state.timeLeft <= 0) {
          clearInterval(interval);
          hasFailed = true;
          setTimeout(() => {
            if (hasFailed) {
              modalMessage = "Desafio finalizado com falha!";
              showModal = true;
            }
          }, 0);
          return { ...state, timeLeft: 0 };
        }
        const updatedState = { ...state, timeLeft: state.timeLeft - 1 };
        localStorage.setItem('challengeState', JSON.stringify(updatedState));
        return updatedState;
      });
    }, 1000);
  }

  function submitChallenge() {
    clearInterval(interval);
    if ($challengeStore.timeLeft > 0) {
      modalMessage = "Desafio finalizado com sucesso!";
    } else {
      modalMessage = "Desafio finalizado com falha!";
    }
    showModal = true;
    localStorage.removeItem('challengeState');
  }

  function navigateToCandidate() {
    goto('/candidate');
  }

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<div class="p-4">
  <h1 class="text-2xl font-bold">Formulário</h1>
  <form on:submit|preventDefault={startChallenge}>
    <div class="mb-4">
      <label class="block mb-1" for="name">Nome</label>
      <input class="border p-2 w-full" id="name" type="text" bind:value={name} />
    </div>
    <div class="mb-4">
      <label class="block mb-1" for="phone">Telefone</label>
      <input class="border p-2 w-full" id="phone" type="text" bind:value={phone} />
    </div>
    <div class="mb-4">
      <label class="block mb-1" for="email">Email</label>
      <input class="border p-2 w-full" id="email" type="email" bind:value={email} />
    </div>
    <button class="bg-blue-500 text-white p-2 rounded" type="submit">Iniciar Desafio</button>
  </form>

  {#if $challengeStore.isChallengeStarted}
    <div class="mt-4">
      <p class="text-lg">Tempo restante: {Math.floor($challengeStore.timeLeft / 60)}:{String($challengeStore.timeLeft % 60).padStart(2, '0')}</p>
      <button class="bg-green-500 text-white p-2 mt-2 rounded" on:click={submitChallenge}>Enviar</button>
    </div>

    <!-- Button to navigate to candidate page -->
    <button class="absolute top-4 right-4 bg-gray-500 text-white p-2 rounded" on:click={navigateToCandidate}>Ir para Candidato</button>
  {/if}

  <!-- Modal component -->
  <Modal isOpen={showModal} onClose={() => (showModal = false)}>
    <p>{modalMessage}</p>
  </Modal>
</div>

