import type { RecordModel } from "pocketbase";
import { writable } from "svelte/store";

export const removeSecret = writable<string | null>(null); // sets with the secret id and then clears after its removed

export const addedSecret = writable<RecordModel | null>(null); // sets with the secret obj and then clears after its added