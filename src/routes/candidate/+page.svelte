<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { challengeStore } from '../../lib/stores/challenge';
  import { goto } from '$app/navigation';

  let challengeState: {
    isChallengeStarted: boolean;
    timeLeft: number;
    name?: string;
    phone?: string;
    email?: string;
  } | undefined;

  // Subscribe to the store on mount
  const unsubscribe = challengeStore.subscribe(state => {
    challengeState = state;
  });

  // Clean up subscription on destroy
  onDestroy(() => {
    unsubscribe();
  });

  function navigateBack() {
    goto('/');
  }
</script>

<div class="p-4">
  <h1 class="text-2xl font-bold">Informações do Candidato</h1>
  {#if challengeState && challengeState.isChallengeStarted}
    <p>Nome: {challengeState.name}</p>
    <p>Telefone: {challengeState.phone}</p>
    <p>Email: {challengeState.email}</p>
  {/if}
  <button class="bg-blue-500 text-white p-2 rounded" on:click={navigateBack}>Voltar ao Desafio</button>
</div>






