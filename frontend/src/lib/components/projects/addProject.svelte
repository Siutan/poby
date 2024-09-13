<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet";
  import { pb } from "$lib/pocketbase";
  import { selectQueries } from "$lib/queries/pbSelect";
  import * as Select from "$lib/components/ui/select";
  import Label from "$lib/components/ui/label/label.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { updateQueries } from "$lib/queries/pbUpdate";
  import { toast } from "svelte-sonner";
  import { Input } from "../ui/input";
  import { toasts } from "../toasts";
  import { createQueries } from "$lib/queries/pbCreate";
  import ShowCredentialsModal from "./showCredentialsModal.svelte";
  import { createEventDispatcher } from "svelte";

  export let open = false;

  let appId = "";
  let appSecret = "";

  const dispatch = createEventDispatcher();

  const handleCreateProject = async (e: Event) => {
    const formData = new FormData(e.target as HTMLFormElement);

    const projectName = formData.get("projectName");

    if (!projectName) {
      toasts.error("Error", {
        description: "Project name is required",
      });
      return;
    }

    const { data, error } = await createQueries.createProject(pb, {
      name: projectName as string,
    });

    if (error || !data) {
      console.error(error);
      toasts.error("Error", { description: "Failed to create project" });
      return;
    }

    toasts.success("Success", { description: "Project created successfully" });
    showModal = false;
    appId = data.app_id;
    appSecret = data.appSecret as string;
    showCredModal();
    open = false;
    dispatch("createdProject");
  };

  let showModal = false;
  const showCredModal = () => {
    showModal = true;
  };
</script>

<ShowCredentialsModal bind:open={showModal} {appId} {appSecret} />

<Sheet.Root bind:open>
  <Sheet.Content>
    <Sheet.Header>
      <Sheet.Title>Create New Project</Sheet.Title>
      <Sheet.Description>
        Create a new project to get started.
      </Sheet.Description>
    </Sheet.Header>
    <div class="flex flex-col gap-4 py-5">
      <form on:submit|preventDefault={handleCreateProject}>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col items-start gap-2">
            <Label for="projectName">Project Name</Label>
            <Input
              type="text"
              id="projectName"
              name="projectName"
              autocomplete="off"
            />
          </div>
          <Button type="submit">Create Project</Button>
        </div>
      </form>
    </div>
  </Sheet.Content>
</Sheet.Root>
