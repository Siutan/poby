<script lang="ts">
  import { pb } from "$lib/pocketbase";
  import { updateQueries } from "$lib/queries/pbUpdate";
  import { Switch } from "$lib/components/ui/switch";
  import { toasts } from "../toasts";
  export let id: string;
  export let active: boolean;

  const handleActive = async () => {
    const { error } = await updateQueries.updateSecret(pb, id, {
      active: !active,
    });

    if (error) {
      console.error(error);
      toasts.error("Error", { description: "Failed to update secret" });
      return;
    }

    toasts.success("Success", { description: "Secret updated successfully" });
  };
</script>

<div class="flex items-center gap-2">
  <Switch includeInput bind:checked={active} on:click={handleActive} />
</div>
