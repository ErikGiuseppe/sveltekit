// src/lib/stores/challenge.ts
import { writable } from 'svelte/store';

interface ChallengeState {
  isChallengeStarted: boolean;
  timeLeft: number;
  name?: string;
  phone?: string;
  email?: string;
}

export const challengeStore = writable<ChallengeState>({
  isChallengeStarted: false,
  timeLeft: 0
});
