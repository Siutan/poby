<script lang="ts">
  import type { RecordModel } from "pocketbase";
  import Button from "../ui/button/button.svelte";
  import { updateQueries } from "$lib/queries/pbUpdate";
  import { pb } from "$lib/pocketbase";
  import { toast } from "svelte-sonner";
  import Input from "../ui/input/input.svelte";
  import Textarea from "../ui/textarea/textarea.svelte";
  import Label from "../ui/label/label.svelte";
  import { currentUser } from "$lib/stores/user";

  export let org: RecordModel | null;

  let oldOrg = org ? { ...org } : null;

  const checkChanges = (org: RecordModel | null) => {
    if (!org || !oldOrg) {
      return false;
    }
    if (org.name.trim() !== oldOrg.name.trim()) {
      return true;
    }
    if (org.description.trim() !== oldOrg.description.trim()) {
      return true;
    }
    return false;
  };

  $: orgChanged = checkChanges(org);

  const handleUpdate = async () => {
    if (!org || !orgChanged) return;
    org.name = org.name.trim();
    org.description = org.description.trim();
    org.logo = org.logo.trim();

    const { error } = await updateQueries.updateOrg(pb, org.id, org);
    if (error) {
      toast.error("Error", {
        description: "Failed to update organisation",
        duration: 3000,
        position: "top-center",
      });
      return;
    }
    toast.success("Success", {
      description: "Organisation updated successfully",
      duration: 3000,
      position: "top-center",
    });
    oldOrg = { ...org };
    orgChanged = false;
  };

  $: isAllowedToEdit = $currentUser?.is_org_admin;
</script>

{#if org}
  <div class="w-full flex flex-col gap-4">
    <h1 class="text-2xl font-bold">General</h1>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <Label for="name" class="text-sm font-medium">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          disabled={!isAllowedToEdit}
          class="w-full rounded-md border-gray-300 p-2 text-sm"
          placeholder="Enter name"
          bind:value={org.name}
        />
      </div>
      <div class="flex flex-col gap-2">
        <Label for="description" class="text-sm font-medium">Description</Label>
        <Textarea
          id="description"
          name="description"
          disabled={!isAllowedToEdit}
          class="w-full rounded-md border-gray-300 p-2 text-sm"
          placeholder="Enter description"
          bind:value={org.description}
        ></Textarea>
      </div>
    </div>
  </div>
  <Button
    variant="default"
    class="w-44"
    disabled={!isAllowedToEdit || !orgChanged}
    on:click={handleUpdate}>Save</Button
  >
{/if}
