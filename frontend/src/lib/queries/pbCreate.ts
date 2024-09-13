import { currentUser } from "$lib/stores/user";
import { get } from "svelte/store";
import { generate } from "$lib/generate";
import type Pocketbase from "pocketbase";

export const createQueries = {
  // projects
  createProject: async (
    pb: Pocketbase,
    data: {
      name: string;
    }
  ) => {
    try {
      const user = get(currentUser);

      const decoder = new TextDecoder();

      const appId = generate.generateId();
      const appSecret = await generate.generateSecret();

      if (!appId || !appSecret) {
        throw new Error("Failed to generate app id and secret");
      }

      // create a project
      const project = await pb.collection("projects").create({
        name: data.name,
        app_id: appId,
        app_secret_hash: appSecret,
      });
      // add the user to the project
      await pb.collection("project_users").create({
        project: project.id,
        user: user?.id,
        role: 2,
      });

      return { data: { ...project, appSecret: appSecret }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  // secrets
  createSecret: async (
    pb: Pocketbase,
    data: {
      projectId: string;
      key: string;
      value: string;
      notes: string;
    }
  ) => {
    try {
      // create a project
      const secret = await pb.collection("secrets").create({
        project: data.projectId,
        key: data.key,
        value: data.value,
        notes: data.notes,
        active: true,
      });

      return { data: secret, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};
