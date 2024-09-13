<script lang="ts">
  import { mediaQuery } from "svelte-legos";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let open = false;
  // biome-ignore lint/style/useConst: <svelte>
  export let title = "Edit profile";
  // biome-ignore lint/style/useConst: <svelte>
  export let description =
    "Make changes to your profile here. Click save when you're done.";
  // biome-ignore lint/style/useConst: <svelte>
  export let label = "Email";
  //` biome-ignore lint/style/useConst: <svelte>
  export let buttonText = "Save changes";
  //` biome-ignore lint/style/useConst: <svelte>
  export let submitTag = "submit";

  export let inputType = "text";

  export let inputValue = "";

  export let btnVariant = "default";
  
  const isDesktop = mediaQuery("(min-width: 768px)");


  const handleSubmit = () => {
    dispatch("submit", {
      submitTag,
      value: inputValue,
    });
    open = false;
  };

  $: if (!open) {
    inputValue = "";
  }
</script>

{#if $isDesktop}
  <Dialog.Root bind:open>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>
          {description}
        </Dialog.Description>
      </Dialog.Header>
      <form class="grid items-start gap-4" on:submit={handleSubmit}>
        <div class="grid gap-2">
          <Label for="input">{label}</Label>
          <Input type="text" id="input" name="input" bind:value={inputValue} autocomplete="off" />
        </div>
        <Button type="submit">{buttonText}</Button>
      </form>
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open>
    <Drawer.Content>
      <Drawer.Header class="text-left">
        <Drawer.Title>{title}</Drawer.Title>
        <Drawer.Description>
          {description}
        </Drawer.Description>
      </Drawer.Header>
      <form class="grid items-start gap-4 px-4" on:submit={handleSubmit}>
        <div class="grid gap-2">
          <Label for="input">{label}</Label>
          {#if inputType === "textarea"}
            <textarea
              name="input"
              id="input"
              autocomplete="off"
              class="w-full rounded-md border border-input py-2 px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              bind:value={inputValue}
            />
            {:else}
            <Input
              type="text"
              id="input"
              name="input"
              bind:value={inputValue}
              autocomplete="off"
            />
            {/if}
        </div>
        <Button variant={btnVariant} type="submit">{buttonText}</Button>
      </form>
      <Drawer.Footer class="pt-2">
        <Drawer.Close asChild let:builder>
          <Button variant="outline" builders={[builder]}>Cancel</Button>
        </Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>
{/if}
