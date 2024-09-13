<script lang="ts">
  import { formatTimeAgo } from "$lib/utils";
  import { currentUser } from "$lib/stores/user";
  import { Button } from "$lib/components/ui/button/index.js";
  import type { PageData } from "./$types";
  import { Cube } from "svelte-radix";
  import ProjectCard from "$lib/components/projectCard.svelte";
  import AddProject from "$lib/components/projects/addProject.svelte";
  import { pb } from "$lib/pocketbase";
  import { selectQueries } from "$lib/queries/pbSelect";
  import { toasts } from "$lib/components/toasts";

  export let data: PageData;

  let openAddProject = false;

  const handleAddProject = () => {
    openAddProject = true;
  };

  const handleNewProject = async () => {
    // fetch new projects
    const { data: fetchProjects, error } =
      await selectQueries.getAllProjects(pb);

    if (error || !fetchProjects) {
      console.error(error);
      toasts.error("Error", { description: "Failed to fetch projects" });
      return;
    }

    data.projects = fetchProjects;
  };
</script>

<AddProject bind:open={openAddProject} on:createdProject={handleNewProject} />

<div class="w-full flex flex-col gap-4">
  {#if $currentUser?.is_org_admin}
    <Button
      variant="default"
      class="w-44 gap-2 group"
      on:click={handleAddProject}
    >
      <Cube
        class="h-4 w-4 group-hover:text-foreground group-hover:rotate-12 duration-300"
      />
      <p class="group-hover:text-foreground duration-300">Create Project</p>
    </Button>
  {/if}
  {#if data.projects.length > 0}
    <div class="w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each data.projects as project}
        <ProjectCard {project} />
      {/each}
    </div>
  {:else}
    <div class="w-full flex items-center justify-center">
      <div
        class="flex flex-col items-center justify-center border p-10 rounded-lg"
      >
        <h1 class="text-2xl font-bold">No projects found.</h1>
        <h4 class="text-sm text-muted-foreground">
          Create a project to get started.
        </h4>
      </div>
    </div>
  {/if}
</div>
