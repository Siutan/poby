<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet";
  import { pb } from "$lib/pocketbase";
  import { selectQueries } from "$lib/queries/pbSelect";
  import * as Select from "$lib/components/ui/select";
  import Label from "$lib/components/ui/label/label.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { updateQueries } from "$lib/queries/pbUpdate";
  import { toast } from "svelte-sonner";

  export let userId: string;
  export let userName: string;
  export let open = false;

  interface Project {
    id: string;
    project: {
      app_id: string;
      name: string;
    };
    role: string;
  }

  const allRoles = [
    { id: "0", name: "Member" },
    { id: "1", name: "Developer" },
    { id: "2", name: "Admin" },
  ];

  let projects: Project[] = [];
  $: selectedProjectId = "";
  $: selectedProjectRole = "0";

  const getAllProjects = async () => {
    const { data, error } = await selectQueries.getProjectsByUserId(pb, userId);
    if (error) {
      console.error(error);
      return [];
    }
    projects = data || [];
    return data || [];
  };

  const handleProjectChange = (event: { value: string }) => {
    selectedProjectId = event.value;
    const selectedProject = projects.find((p) => p.id === selectedProjectId);
    if (selectedProject) {
      selectedProjectRole = selectedProject.role;
    }
  };

  const handleRoleChange = (event: { value: string }) => {
    selectedProjectRole = event.value;
  };

  const handleSave = async () => {
    const selectedProject = projects.find((p) => p.id === selectedProjectId);
    if (!selectedProject) return;

    const { error } = await updateQueries.updateProjectRole(
      pb,
      selectedProjectId,
      {
        user: userId,
        role: selectedProjectRole,
      }
    );

    if (error) {
      toast.error("Error", {
        description: "Failed to update project role",
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    toast.success("Success", {
      description: "Project role updated successfully",
      duration: 3000,
      position: "top-center",
    });

    // clear selected project
    selectedProjectId = "";
    selectedProjectRole = "0";

    open = false;
  };

  $: isRoleChanged =
    selectedProjectRole !==
    projects.find((p) => p.id === selectedProjectId)?.role;
</script>

<Sheet.Root bind:open>
  <Sheet.Content>
    <Sheet.Header>
      <Sheet.Title>Manage Access Scopes</Sheet.Title>
      <Sheet.Description>
        Manage {userName}'s access scopes for each project
      </Sheet.Description>
    </Sheet.Header>
    <div class="flex flex-col gap-4 py-5">
      {#await getAllProjects()}
        <div class="w-full flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-bold">Loading...</h2>
          </div>
        </div>
      {:then fetchedProjects}
        {#if fetchedProjects.length > 0}
          {@const projects = fetchedProjects}
          <Label for="project" class="text-sm font-medium">Project</Label>
          <Select.Root name="project" onSelectedChange={handleProjectChange}>
            <Select.Trigger class="w-[180px]">
              <Select.Value placeholder="Select Project" />
            </Select.Trigger>
            <Select.Content>
              {#each projects as project}
                <Select.Item value={project.id}
                  >{project.project.name}</Select.Item
                >
              {/each}
            </Select.Content>
          </Select.Root>

          {#if selectedProjectId}
            <Label for="role" class="text-sm font-medium">Role</Label>
            <Select.Root
              name="role"
              selected={{
                value: selectedProjectRole,
                label: allRoles.find((r) => r.id === selectedProjectRole)?.name,
              }}
              onSelectedChange={handleRoleChange}
            >
              <Select.Trigger class="w-[180px]">
                <Select.Value placeholder="Select Role" />
              </Select.Trigger>
              <Select.Content>
                {#each allRoles as role}
                  <Select.Item value={role.id}>{role.name}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
            <Button
              variant="default"
              disabled={!isRoleChanged}
              on:click={handleSave}
            >
              Save
            </Button>
          {/if}
        {:else}
          <p>No projects found.</p>
        {/if}
      {/await}
    </div>
  </Sheet.Content>
</Sheet.Root>
