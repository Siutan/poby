<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import ThemeSwitcher from "./themeSwitcher.svelte";
  import {
    BoxModel,
    HamburgerMenu,
    MagnifyingGlass,
    Person,
  } from "svelte-radix";

  let sheetOpen = false;
</script>

<header
  class="bg-background sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6"
>
  <nav
    class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
  >
    <a
      href="/"
      class="flex items-center gap-2 text-lg font-semibold md:text-base group"
    >
      <BoxModel class="rotate-45 w-6 h-6 group-hover:-rotate-180 duration-500" />
      POBY
      <span class="sr-only">Poby</span>
    </a>
    <a
      href="/"
      class="text-muted-foreground hover:text-foreground transition-colors"
    >
      Home
    </a>
    <a
      href="/org"
      class="text-muted-foreground hover:text-foreground transition-colors"
    >
      Organisation
    </a>
  </nav>
  <Sheet.Root bind:open={sheetOpen}>
    <Sheet.Trigger asChild let:builder>
      <Button
        variant="outline"
        size="icon"
        class="shrink-0 md:hidden"
        builders={[builder]}
      >
        <HamburgerMenu class="h-5 w-5" />
        <span class="sr-only">Toggle navigation menu</span>
      </Button>
    </Sheet.Trigger>
    <Sheet.Content side="left" class="max-w-72">
      <nav class="grid gap-6 text-lg font-medium">
        <a href="/" class="flex items-center gap-2 text-lg font-semibold">
          <BoxModel class="rotate-45 w-6 h-6" />
          POBY
          <span class="sr-only">Poby</span>
        </a>
        <a href="/" class="text-muted-foreground hover:text-foreground" on:click={() => sheetOpen = false}>
          Home
        </a>
        <a href="/org" class="text-muted-foreground hover:text-foreground" on:click={() => sheetOpen = false}>
          Organisation
        </a>
      </nav>
    </Sheet.Content>
  </Sheet.Root>
  <div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
    <form class="ml-auto flex-1 sm:flex-initial">
      <div class="relative">
        <MagnifyingGlass
          class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4"
        />
        <Input
          type="search"
          placeholder="Search Projects..."
          class="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
        />
      </div>
    </form>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
        <Button
          builders={[builder]}
          variant="secondary"
          size="icon"
          class="rounded-full"
        >
          <Person class="h-5 w-5" />
          <span class="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Label>
          <ThemeSwitcher isCollapsed={false} />
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Label>My Account</DropdownMenu.Label>
        <DropdownMenu.Item on:click={() => goto("/org")}>Settings</DropdownMenu.Item>
        <DropdownMenu.Item>Support</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Label>Actions</DropdownMenu.Label>
        <DropdownMenu.Item>Logout</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</header>
