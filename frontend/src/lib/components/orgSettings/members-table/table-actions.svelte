<script lang="ts">
  import { DotsVertical } from "svelte-radix";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import ScopeList from "./scopeSheet.svelte";

  export let id: string;
  export let name: string;

  let open = false;
</script>

<ScopeList userId={id} userName={name} bind:open />

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      variant="ghost"
      builders={[builder]}
      size="icon"
      class="relative h-8 w-8 p-0"
    >
      <span class="sr-only">Open menu</span>
      <DotsVertical class="h-4 w-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item on:click={() => (open = true)}>Manage Scopes</DropdownMenu.Item>
    <DropdownMenu.Item class="bg-rose-500/40 mt-1">Remove Member</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
