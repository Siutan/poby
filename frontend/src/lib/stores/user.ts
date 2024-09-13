import type { BaseModel } from "pocketbase";
import { writable } from "svelte/store";

export const currentUser = writable<BaseModel | null>();
