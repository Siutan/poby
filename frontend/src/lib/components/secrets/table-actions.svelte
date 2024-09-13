<script lang="ts">
  import { DotsVertical } from "svelte-radix";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import { pb } from "$lib/pocketbase";
  import { deleteQueries } from "$lib/queries/pbDelete";
  import { toasts } from "$lib/components/toasts";
  import { removeSecret } from "$lib/stores/utilities";

  export let id: string;

  const handleDelete = async () => {
    const { error } = await deleteQueries.deleteSecret(pb, id);

    if (error) {
      toasts.error("Error", { description: "Failed to delete secret" });
      return;
    }
    toasts.success("Success", { description: "Secret deleted successfully" });

    removeSecret.set(id);
  };
</script>

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
    <DropdownMenu.Label>Actions</DropdownMenu.Label>
    <DropdownMenu.Item class="bg-rose-500" on:click={handleDelete}
      >Delete</DropdownMenu.Item
    >
  </DropdownMenu.Content>
</DropdownMenu.Root>
