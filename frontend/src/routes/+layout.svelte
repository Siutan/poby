<script lang="ts">
  import Sonner from "$lib/components/ui/sonner/sonner.svelte";
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  import { currentUser } from "$lib/stores/user";
  import type { PageData } from "./$types";
  import Navbar from "$lib/components/navbar.svelte";
  import { screenWidth } from "$lib/stores/screen";

  export let data: PageData;

  // Set the current user from the data passed in from the server
  $: currentUser.set(data.user);
</script>

<svelte:window bind:innerWidth={$screenWidth} />

<ModeWatcher />
<Sonner />
{#if $currentUser}
  <Navbar />
{/if}

<div class="max-w-6xl mx-auto py-8 px-4">
  <slot />
</div>
