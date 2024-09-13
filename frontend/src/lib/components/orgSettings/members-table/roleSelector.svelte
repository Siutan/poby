<script lang="ts">
  import * as Select from "$lib/components/ui/select";
  import Label from "$lib/components/ui/label/label.svelte";
  import { pb } from "$lib/pocketbase";
  import { updateQueries } from "$lib/queries/pbUpdate";
  import { toast } from "svelte-sonner";

  export let selectedRole: string;
  export let recordId: string;

  const allRoles = [
    { id: "0", name: "Member" },
    { id: "1", name: "Developer" },
    { id: "2", name: "Admin" },
  ];

  const handleRoleChange = async (event: { value: string }) => {

    const { error } = await updateQueries.updateProjectRole(
      pb,
      recordId,
      {role: event.value}
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
  };
</script>

<div class="w-full flex flex-col gap-4">
  <Select.Root
    name="role"
    onSelectedChange={handleRoleChange}
    selected={{
      value: selectedRole,
      label: allRoles.find((r) => r.id === selectedRole)?.name,
    }}
  >
    <Select.Trigger class="w-[180px]">
      <Select.Value placeholder="Select Project" />
    </Select.Trigger>
    <Select.Content>
      {#each allRoles as role}
        <Select.Item value={role.id}>{role.name}</Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
</div>
