import { currentUser } from "$lib/stores/user";
import type Pocketbase from "pocketbase";
import { get } from "svelte/store";

export const deleteQueries = {
    // projects
    deleteProject: async (pb: Pocketbase, id: string) => {
        try {
            const data = await pb.collection("projects").delete(id);
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },
    // secrets
    deleteSecret: async (pb: Pocketbase, id: string) => {
        try {
            const data = await pb.collection("secrets").delete(id);
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },
}