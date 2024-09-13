<script lang="ts">
  import { currentUser } from "$lib/stores/user";
  import { mediaQuery } from "svelte-legos";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { toasts } from "../toasts";

  // biome-ignore lint/style/useConst: <svelte>
  export let open = false;

  export let appId: string;
  export let appSecret: string;

  const handleCopy = () => {
    navigator.clipboard.writeText(appSecret);
    toasts.success("Success", { description: "App secret copied to clipboard" });
  };

  const isDesktop = mediaQuery("(min-width: 768px)");


</script>

{#if $isDesktop}
  <Dialog.Root bind:open>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Project Credentials</Dialog.Title>
        <Dialog.Description>
          Copy your project credentials to use in your app. Once you close this,
          you won't be able to see the app secret again.
        </Dialog.Description>
      </Dialog.Header>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col items-start gap-2">
          <Label for="appId">App ID</Label>
          <Input value={appId} readonly />
        </div>
        <div class="flex flex-col items-start gap-2">
          <Label for="appSecret">App Secret</Label>
          <div class="flex gap-2 w-full">
            <Input id="appSecret" value={appSecret} readonly />
            <Button variant="ghost" on:click={handleCopy}>Copy</Button>
          </div>
        </div>
      </div>
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open>
    <Drawer.Content>
      <Drawer.Header class="text-left">
        <Drawer.Title>Project Credentials</Drawer.Title>
        <Drawer.Description>
          Copy your project credentials to use in your app. Once you close this,
          you won't be able to see the app secret again.
        </Drawer.Description>
      </Drawer.Header>
      <div class="flex flex-col gap-4 p-4">
        <div class="flex flex-col items-start gap-2">
          <Label for="appId">App ID</Label>
          <Input id="appId" value={appId} readonly />
        </div>
        <div class="flex flex-col items-start gap-2">
          <Label for="appSecret">App Secret</Label>
          <div class="flex gap-2 w-full">
            <Input id="appSecret" value={appSecret} readonly />
            <Button variant="ghost" on:click={handleCopy}>Copy</Button>
          </div>
        </div>
      </div>
      <Drawer.Footer class="pt-2">
        <Drawer.Close asChild let:builder>
          <Button variant="outline" builders={[builder]}>Done</Button>
        </Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>
{/if}
