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
  export let btn1Text = "Done";
  //` biome-ignore lint/style/useConst: <svelte>
  export let btn1Variant = "";
  // biome-ignore lint/style/useConst: <svelte>
  export let btn2Text = "Done";
  //` biome-ignore lint/style/useConst: <svelte>
  export let btn2Variant = "";

  const isDesktop = mediaQuery("(min-width: 768px)");

  const handleClick = (btn: string) => {
    dispatch("submit", btn);
    open = false;
  };
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
      <div class="flex items-center justify-start gap-4">
        <Button variant={btn1Variant} on:click={() => handleClick("1")}
          >{btn1Text}</Button
        >
        <Button
          variant={btn2Variant}
          on:click={() => {
            handleClick("2");
          }}>{btn2Text}</Button
        >
      </div>
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
      <div class="flex items-center justify-start gap-4 p-4">
        <Button variant={btn1Variant}>{btn1Text}</Button>
        <Button variant={btn2Variant}>{btn2Text}</Button>
      </div>
      <Drawer.Footer class="pt-2">
        <Drawer.Close asChild let:builder>
          <Button variant="outline" builders={[builder]}>Cancel</Button>
        </Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>
{/if}
