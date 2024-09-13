<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet";
  import { pb } from "$lib/pocketbase";
  import { selectQueries } from "$lib/queries/pbSelect";
  import * as Select from "$lib/components/ui/select";
  import Label from "$lib/components/ui/label/label.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { updateQueries } from "$lib/queries/pbUpdate";
  import { toast } from "svelte-sonner";
  import { createQueries } from "$lib/queries/pbCreate";
  import { toasts } from "../toasts";
  import { addedSecret } from "$lib/stores/utilities";

  export let projectId: string;
  export let open = false;

  const getProjectName = async () => {
    const { data, error } = await selectQueries.getProjectById(pb, projectId);
    if (error) {
      console.error(error);
      return "";
    }
    return data?.project?.name || "";
  };

  const getData = async () => {
    const projectName = await getProjectName();
    return { projectName };
  };

  const handleSubmit = async (e: Event) => {
    const formData = new FormData(e.target as HTMLFormElement);
    const { key, value, notes } = Object.fromEntries(formData);
    
    if (!key || !value) {
      toasts.error("Error", { description: "Key and value are required" });
      return;
    }

    const { data, error } = await createQueries.createSecret(pb, {
      projectId: projectId,
      key: key as string,
      value: value as string,
      notes: notes as string,
    });

    if (error) {
        toasts.error("Error", { description: "Failed to create secret" });
        return;
    }

    toasts.success("Success", { description: "Secret created successfully" });

    addedSecret.set(data);
    open = false;
  };
</script>

<Sheet.Root bind:open>
  <Sheet.Content>
    {#await getData()}
      <div class="w-full flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold">Loading...</h2>
        </div>
      </div>
    {:then rData}
      <Sheet.Header>
        <Sheet.Title>Add Secret</Sheet.Title>
        <Sheet.Description>
          Create a secret for {rData.projectName}
        </Sheet.Description>
      </Sheet.Header>
      <div class="flex flex-col gap-4 py-5">
        <form class="flex flex-col gap-4" on:submit={handleSubmit}>
          <Label for="key" class="text-sm font-medium">Key</Label>
          <input
            type="text"
            name="key"
            id="key"
            autocomplete="off"
            class="w-full rounded-md border border-input py-2 px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Label for="value" class="text-sm font-medium">Value</Label>
          <textarea
            name="value"
            id="value"
            autocomplete="off"
            class="w-full rounded-md border border-input py-2 px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Label for="notes" class="text-sm font-medium">Notes</Label>
          <textarea
            name="notes"
            id="notes"
            autocomplete="off"
            class="w-full rounded-md border border-input py-2 px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button variant="default" class="w-full" type="submit">Save</Button>
        </form>
      </div>
    {/await}
  </Sheet.Content>
</Sheet.Root>
