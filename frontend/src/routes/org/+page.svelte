<script lang="ts">
  import { formatTimeAgo } from "$lib/utils";
  import { currentUser } from "$lib/stores/user";
  import { Button } from "$lib/components/ui/button/index.js";
  import type { PageData } from "./$types";
  import { Cube } from "svelte-radix";
  import ProjectCard from "$lib/components/projectCard.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { mediaQuery } from "svelte-legos";
  import General from "$lib/components/orgSettings/general.svelte";
  import ManageMembers from "$lib/components/orgSettings/manage-members.svelte";

  export let data: PageData;

  let selected = "general";

  $: isDesktop = mediaQuery("(min-width: 768px)");
</script>

<div class="w-full flex flex-col md:flex-row md:items-start gap-4">
  <nav class="flex md:flex-col gap-4 md:min-w-48 p-5 border rounded-md">
    <div class="w-full flex md:flex-col items-start gap-2 text-sm">
      <button
        on:click={() => {
          selected = "general";
        }}
        class="w-full h-full text-start items-start px-3 py-2 rounded-md {selected ===
        'general'
          ? 'bg-primary'
          : 'hover:bg-primary-foreground'} duration-300"
      >
        General
      </button>
      <Separator orientation={$isDesktop ? "horizontal" : "vertical"} />
      <button
        on:click={() => {
          selected = "manage-projects";
        }}
        class="w-full text-start items-start px-3 py-2 rounded-md {selected ===
        'manage-projects'
          ? 'bg-primary'
          : 'hover:bg-primary-foreground'} duration-300"
      >
        Manage Projects
      </button>
      <Separator orientation={$isDesktop ? "horizontal" : "vertical"} />
      <button
        on:click={() => {
          selected = "manage-members";
        }}
        class="w-full text-start items-start px-3 py-2 rounded-md {selected ===
        'manage-members'
          ? 'bg-primary'
          : 'hover:bg-primary-foreground'} duration-300"
      >
        Manage Members
      </button>
    </div>
  </nav>

  <div class="flex flex-col gap-4 w-full p-10">
    {#if selected === "general"}
      <General org={data.org} />
    {:else if selected === "manage-projects"}
      manage-projects
    {:else if selected === "manage-members"}
      <ManageMembers org={data.org} />
    {/if}
  </div>
</div>
