<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet";
  import { pb } from "$lib/pocketbase";
  import { selectQueries } from "$lib/queries/pbSelect";
  import * as Select from "$lib/components/ui/select";
  import Label from "$lib/components/ui/label/label.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { updateQueries } from "$lib/queries/pbUpdate";
  import { toast } from "svelte-sonner";

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

  const getMembers = async () => {
    const { data, error } = await selectQueries.getUsersNotInProject(
      pb,
      projectId
    );
    if (error) {
      console.error(error);
      return [];
    }
    return data || [];
  };

  const getData = async () => {
    const projectName = await getProjectName();
    const members = await getMembers();
    return { projectName, members };
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
        <Sheet.Title>Add Members</Sheet.Title>
        <Sheet.Description>
          Give members from your organisation access to {rData.projectName}
        </Sheet.Description>
      </Sheet.Header>
      <div class="flex flex-col gap-4 py-5">
        {#if rData.members.length > 0}
          <div class="flex flex-col gap-4">
            {#each rData.members as member}
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-bold">{member.expand?.user?.name}</h2>
              </div>
            {/each}
          </div>
        {:else}
          <p>No members found.</p>
        {/if}
      </div>
    {/await}
  </Sheet.Content>
</Sheet.Root>
