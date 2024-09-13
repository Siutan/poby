<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { DotsVertical, Pencil1, Person } from "svelte-radix";
  import FormModal from "./formModal.svelte";
  import { updateQueries } from "$lib/queries/pbUpdate";
  import { pb } from "$lib/pocketbase";
  import { toast } from "svelte-sonner";
  import { createEventDispatcher } from "svelte";
  import { selectQueries } from "$lib/queries/pbSelect";
  import { deleteQueries } from "$lib/queries/pbDelete";
  import { toasts } from "./toasts";
  import { goto } from "$app/navigation";
  import OptionModal from "./optionModal.svelte";

  const dispatch = createEventDispatcher();

  export let id: string;

  export let active: boolean;

  let open = false;

  let title = "Edit profile";

  let description =
    "Make changes to your profile here. Click save when you're done.";

  let label = "Email";

  let buttonText = "Save changes";

  let submitTag = "submit";

  const handleChangeName = () => {
    open = true;
    title = "Change Project Name";
    description = "Rename your project. Click save when you're done.";
    label = "Name";
    buttonText = "Save changes";
    submitTag = "nameChange";
    open = true;
  };

  const handleFormSubmit = async (e: CustomEvent) => {
    const { submitTag, value } = e.detail;

    switch (submitTag) {
      case "nameChange":
        {
          const { error } = await updateQueries.updateProjectName(pb, id, {
            name: value,
            active: false,
          });
          if (error) {
            toasts.error("Error", {
              description: "Failed to update project name",
            });
            return;
          }
          toasts.success("Success", {
            description: "Project name updated successfully",
          });
          dispatch("nameChange", value);
        }
        break;
      case "delete":
        {
          const projectName = await getProjectName();
          if (value !== projectName) {
            toasts.error("Error", {
              description: "Project name does not match",
            });
            return;
          }
          const { error } = await deleteQueries.deleteProject(pb, id);
          if (error) {
            toasts.error("Error", { description: "Failed to delete project" });
            return;
          }
          toasts.success("Success", {
            description: "Project deleted successfully",
          });
          goto("/");
        }
        break;
      case "submit":
        break;
    }
  };

  const handleDeleteProject = async () => {
    const projectName = await getProjectName();
    title = `Are you sure you want to delete ${projectName}?`;
    description =
      "This action cannot be undone. Please type the name of the project to confirm.";
    label = "Delete Project";
    buttonText = "Delete Project";
    submitTag = "delete";
    open = true;
  };

  const getProjectName = async () => {
    const { error, data } = await selectQueries.getProjectById(pb, id);
    if (error || !data) {
      console.error(error);
      return;
    }
    return data.name;
  };

  let optionModalOpen: boolean;
  const handleDeactivateProject = async (e: CustomEvent) => {
    const btnVal = e.detail;

    if (btnVal !== "1") return;
    const { error } = await updateQueries.toggleProjectStatus(pb, id, !active);
    if (error) {
      toasts.error("Error", {
        description: `Could not ${active ? "deactivate" : "activate"} Project`,
      });
      return;
    }
    toasts.success("Success", {
      description: `${active ? "Deactivated" : "Activated"} project`,
    });
    active = !active;
  };
</script>

<OptionModal
  bind:open={optionModalOpen}
  title="{active ? 'Deactivate' : 'Activate'} Project?"
  description="Deactivating or activating will restrict access accordingly to all usages of this project within code."
  btn1Text={active ? "Deactivate" : "Activate"}
  btn1Variant={active ? "destructive" : "default"}
  btn2Text="cancel"
  btn2Variant="ghost"
  on:submit={handleDeactivateProject}
/>

<FormModal
  bind:open
  {title}
  {description}
  {label}
  {buttonText}
  {submitTag}
  on:submit={handleFormSubmit}
/>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" size="icon">
      <DotsVertical class="h-4 w-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56">
    <DropdownMenu.Label>Project Actions</DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.Group>
      <DropdownMenu.Item
        on:click={handleChangeName}
        class="flex gap-2 items-center group"
      >
        <Pencil1 class="h-4 w-4" />
        <p>Change Name</p>
      </DropdownMenu.Item>
      <DropdownMenu.Item class="flex gap-2 items-center group">
        <Person class="h-4 w-4" />
        <p>Manage Members</p>
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item
      on:click={() => (optionModalOpen = true)}
    >
      {active ? 'Deactivate' : 'Activate'} Project
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item class="bg-destructive" on:click={handleDeleteProject}>
      Delete Project
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
