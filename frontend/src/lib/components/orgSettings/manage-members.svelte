<script lang="ts">
  import MembersTable from "./members-table/members-table.svelte";
  import { pb } from "$lib/pocketbase";
  import { selectQueries } from "$lib/queries/pbSelect";
  import type { RecordModel } from "pocketbase";
  import * as Select from "$lib/components/ui/select";
  import Button from "$lib/components/ui/button/button.svelte";
  import AddSheet from "./members-table/addSheet.svelte";

  export let org: RecordModel | null;

  const getAllData = async () => {
    const { data: usersData, error: usersError } =
      await selectQueries.getAllUsers(pb);
    const { data: projectsData, error: projectsError } =
      await selectQueries.getAllProjects(pb);

    if (usersError || projectsError) {
      console.error(usersError || projectsError);
      return { usersData: [], projectsData: [], projectMembersData: [] };
    }

    return { usersData: usersData || [], projectsData: projectsData || [] };
  };

  const getProjectMembers = async (projectId: string) => {
    const { data, error } = await selectQueries.getProjectUsers(pb, projectId);
    if (error) {
      console.error(error);
      return [];
    }
    const mappedData = data?.map((item) => {
      return {
        id: item.id,
        role: item.role,
        projectId: item.project,
        name: item.expand?.user?.name,
        email: item.expand?.user?.email,
      };
    });
    return mappedData || [];
  };

  const handleProjectChange = (event: { value: string }) => {
    selectedProjectId = event.value;
  };

  let selectedProjectId = "";
  let open = false;
</script>

<AddSheet projectId={selectedProjectId} bind:open />

<div class="w-full flex flex-col gap-4">
  <h1 class="text-2xl font-bold">Manage Users</h1>
  {#await getAllData()}
    <div class="w-full flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <h2 class="text-xl font-bold">Loading...</h2>
      </div>
    </div>
  {:then rData}
    <div class="flex w-full items-center justify-between">
      <Select.Root name="project" onSelectedChange={handleProjectChange}>
        <Select.Trigger class="w-[180px]">
          <Select.Value placeholder="Select Project" />
        </Select.Trigger>
        <Select.Content>
          {#each rData.projectsData as project}
            <Select.Item value={project.id}>{project.name}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
      {#if selectedProjectId}
        <div>
          <Button variant="default" on:click={() => (open = true)}>Add Members</Button>
        </div>
      {/if}
    </div>
    {#if !selectedProjectId}
      <MembersTable
        tableData={rData.usersData}
        type="user"
        recordId={selectedProjectId}
      />
    {:else}
      {#await getProjectMembers(selectedProjectId)}
        <div class="w-full flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-bold">Loading...</h2>
          </div>
        </div>
      {:then rData}
        <MembersTable tableData={rData} type="role" recordId={rData[0].id} />
      {/await}
    {/if}
  {/await}
</div>
