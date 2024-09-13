<script lang="ts">
  import { getDate, parseRole } from "$lib/utils";
  import type { PageData } from "./$types";
  import SecretsTable from "$lib/components/secrets/secrets-table.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import ProjectActions from "$lib/components/projectActions.svelte";
  import AddSecret from "$lib/components/secrets/addSecret.svelte";
  import { removeSecret, addedSecret } from "$lib/stores/utilities";
  import { Badge } from "$lib/components/ui/badge";

  export let data: PageData;

  let tableData = data.secrets.map((secret) => {
    return {
      id: secret.id,
      created: secret.created,
      value: secret.value,
      key: secret.key,
      active: secret.active,
      notes: secret.notes,
    };
  });

  const handleNameChange = (e: CustomEvent) => {
    const { detail } = e;
    if (data.project) {
      data.project.name = detail;
    }
  };

  const handleAddSecret = () => {
    open = false;
    open = true;
  };

  let open = false;

  removeSecret.subscribe((id) => {
    if (tableData && id) {
      tableData = tableData.filter((secret) => secret.id !== id);
      removeSecret.set(null);
    }
  });

  addedSecret.subscribe((secret) => {
    if (tableData && secret) {
      const secretModel = {
        id: secret.id,
        created: secret.created,
        value: secret.value,
        key: secret.key,
        active: secret.active,
        notes: secret.notes,
      };
      tableData = [secretModel, ...tableData];
      addedSecret.set(null);
    }
  });
</script>

<div class="w-full flex flex-col gap-4">
  {#if data.project}
    <AddSecret projectId={data.project.id} {open} />
    <div class="w-full flex flex-col gap-1">
      <div class="flex items-center">
        <div class="flex flex-col items-start gap-2">
          <Badge variant={data.project.active ? "default" : "destructive"}
            >{data.project.active ? "Active" : "Inactive"}</Badge
          >
          <div class="font-semibold">{data.project.name}</div>
        </div>

        <div class="flex items-center gap-2 ml-auto text-xs text-foreground">
          {getDate(new Date(data.project.created))}
          <ProjectActions
            id={data.project.id}
            bind:active={data.project.active}
            on:nameChange={handleNameChange}
          />
        </div>
      </div>
      <div class="text-xs font-medium text-muted-foreground">
        {data.project.app_id}
      </div>
    </div>
  {/if}
  {#if data.projectRole}
    <Button variant="secondary" class="w-full" on:click={handleAddSecret}
      >Add Secret</Button
    >
  {/if}
  <SecretsTable {tableData} />
</div>
