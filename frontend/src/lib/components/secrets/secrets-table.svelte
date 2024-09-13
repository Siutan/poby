<script lang="ts">
  import {
    createTable,
    Render,
    Subscribe,
    createRender,
  } from "svelte-headless-table";
  import { derived, writable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
  import DataTableActions from "./table-actions.svelte";
  import ActiveSwitch from "./activeSwitch.svelte";
  import { screenWidth } from "$lib/stores/screen";
  import FormModal from "../formModal.svelte";
  import { pb } from "$lib/pocketbase";
  import { updateQueries } from "$lib/queries/pbUpdate";
  import { toasts } from "../toasts";

  type Secret = {
    id: string;
    created: string;
    key: string;
    value: string;
    notes: string;
    active: boolean;
  };

  export let tableData: Secret[] = [];

  const tableDataStore = writable(tableData);

  $: {
    tableDataStore.set(tableData);
  }

  $: table = createTable(tableDataStore);

  $: columns = table.createColumns([
    table.column({
      accessor: "key",
      header: "Key",
    }),
    table.column({
      accessor: "value",
      header: "Value",
      cell: ({ value }) => {
        return value;
      },
    }),
    table.column({
      accessor: "notes",
      header: "Notes",
      cell: ({ value }) => {
        return value ? value : "No notes";
      },
    }),
    table.column({
      accessor: "active",
      header: "Active",
      cell: ({ value, row }) => {
        return createRender(ActiveSwitch, {
          id: row.original.id,
          active: value,
        });
      },
    }),
    table.column({
      accessor: ({ id }) => id,
      header: "",
      cell: ({ value }) => {
        return createRender(DataTableActions, { id: value });
      },
    }),
  ]);

  $: ({ headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns));

  const maxLength = derived(screenWidth, ($screenWidth) =>
    $screenWidth ? Math.max(50, Math.floor($screenWidth / 10)) : 100
  );

  let openNoteModal = false;
  let secretId = "";
  let noteValue = "";

  const handleEditNote = async (e: CustomEvent) => {
    const { value } = e.detail;
    const { error } = await updateQueries.updateSecret(pb, secretId, {
      notes: value,
    });

    if (error) {
      console.error(error);
      toasts.error("Error", { description: "Failed to update secret" });
      return;
    }

    toasts.success("Success", { description: "Secret updated successfully" });
    tableData = tableData.map((secret) => {
      if (secret.id === secretId) {
        return {
          ...secret,
          notes: value,
        };
      }
      return secret;
    });
  };

  const handleClickEditNote = (id: string) => {
    secretId = id;
    noteValue = tableData.find((secret) => secret.id === id)?.notes || "";
    openNoteModal = true;
  };
</script>

<FormModal
  bind:open={openNoteModal}
  buttonText={"Save Note"}
  inputValue={noteValue}
  submitTag={"note"}
  title={"Edit Note"}
  description={"Edit the note for this secret"}
  label={"Note"}
  inputType={"textarea"}
  on:submit={handleEditNote}
/>

<div class="rounded-lg border">
  {#if $tableDataStore.length > 0}
    <Table.Root {...$tableAttrs}>
      <Table.Header>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                  <Table.Head {...attrs}>
                    <Render of={cell.render()} />
                  </Table.Head>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Header>
      <Table.Body {...$tableBodyAttrs}>
        {#each $pageRows as row (row.id)}
          <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
            <Table.Row {...rowAttrs}>
              {#each row.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <Table.Cell {...attrs}>
                    {#if cell.id === "notes"}
                      <button
                        on:click={() => handleClickEditNote(row.original.id)}
                      >
                        <div class="md:hidden truncate">
                          {cell.render().toString().length > 50
                            ? cell
                                .render()
                                .toString()
                                .slice(0, $maxLength * 0.2) + "..."
                            : cell.render().toString()}
                        </div>
                        <div class="hidden md:block lg:hidden truncate">
                          {cell.render().toString().length > 100
                            ? cell
                                .render()
                                .toString()
                                .slice(0, $maxLength * 0.2) + "..."
                            : cell.render().toString()}
                        </div>
                        <div class="hidden lg:block truncate">
                          {cell.render().toString().length > 500
                            ? cell
                                .render()
                                .toString()
                                .slice(0, $maxLength * 0.2) + "..."
                            : cell.render().toString()}
                        </div>
                      </button>
                    {:else}
                      <Render of={cell.render()} />
                    {/if}
                  </Table.Cell>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Body>
    </Table.Root>
  {:else}
    <div class="flex items-center justify-center h-full">
      <div class="p-10 text-center">
        <h1 class="text-2xl font-bold">No secrets found.</h1>
        <h4 class="text-sm text-muted-foreground">
          Add a secret to get started.
        </h4>
      </div>
    </div>
  {/if}
</div>
