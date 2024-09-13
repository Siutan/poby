<script lang="ts">
  import { getDate } from "$lib/utils";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { goto } from "$app/navigation";
  
  export let project;
</script>

<button
on:click={() => goto(`/${project.app_id}`)}
  class="min-w-full md:min-w-88 max-w-min h-30 md:h-40 hover:bg-accent hover:scale-105 active:scale-95 flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all"
>
  <div class="flex w-full h-full flex-col justify-between gap-1">
    <div class="flex items-center justify-between">
      <div class="font-semibold">{project.name}</div>
      <Badge variant="{project.active ? 'default' : 'destructive'}">{project.active? "Active" : "Inactive"}</Badge>
    </div>

    <div class="flex items-center gap-2">
      <div class="text-xs font-medium text-muted-foreground">{project.app_id}</div>
      <div class="ml-auto text-xs text-foreground">
        {getDate(new Date(project.created))}
      </div>
    </div>
  </div>
</button>
