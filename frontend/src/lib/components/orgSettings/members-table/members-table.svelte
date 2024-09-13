<script lang="ts">
  import {
    createTable,
    Render,
    Subscribe,
    createRender,
  } from "svelte-headless-table";
  import { readable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
  import DataTableActions from "./table-actions.svelte";
  import RoleSelector from "./roleSelector.svelte";
  import type { RecordModel } from "pocketbase";

  export let tableData: RecordModel[] = [];
  export let recordId = "";
  export let type: "user" | "role" = "user";

  const table = createTable(readable(tableData));

  const userColumns = table.createColumns([
    table.column({
      accessor: "name",
      header: "Name",
    }),
    table.column({
      accessor: "email",
      header: "Email",
    }),
    table.column({
      accessor: ({ id }) => id,
      header: "",
      cell: ({ value, row }) => {
        return createRender(DataTableActions, {
          id: value,
          name: row.cells[0].value,
        });
      },
    }),
  ]);

  const roleColumns = table.createColumns([
    table.column({
      accessor: "name",
      header: "Name",
    }),
    table.column({
      accessor: "email",
      header: "Email",
    }),
    table.column({
      accessor: "role",
      header: "Role",
      cell: ({ value }) => {
        return createRender(RoleSelector, {
          selectedRole: value,
          recordId: recordId,
        });
      },
    }),
    table.column({
      accessor: ({ id }) => id,
      header: "",
      cell: ({ value, row }) => {
        return createRender(DataTableActions, {
          id: value,
          name: row.cells[0].value,
        });
      },
    }),
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(type === "user" ? userColumns : roleColumns);
</script>

<div class="rounded-lg border">
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
                  <Render of={cell.render()} />
                </Table.Cell>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
