import { currentUser } from "$lib/stores/user";
import type Pocketbase from "pocketbase";
import { get } from "svelte/store";

export const selectQueries = {
  // org
  getOrg: async (pb: Pocketbase) => {
    try {
      const data = await pb.collection("organisation").getFirstListItem("");
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  // users
  getAllUsers: async (pb: Pocketbase) => {
    try {
      const data = await pb.collection("users").getFullList({
        sort: "name",
      });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  // projects
  getAllProjects: async (pb: Pocketbase) => {
    try {
      const data = await pb.collection("projects").getFullList({
        sort: "-created",
      });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  getProjectsByUserId: async (pb: Pocketbase, userId: string) => {
    try {
      const data = await pb.collection("project_users").getFullList({
        filter: `user.id = "${userId}"`,
        sort: "-created",
        expand: "project",
      });
      const mappedData = data.map((item) => {
        return {
          id: item.id,
          project: item.expand?.project,
          role: item.role,
        };
      });
      return { data: mappedData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  searchProjects: async (pb: Pocketbase, query: string) => {
    try {
      const data = await pb.collection("projects").getFullList({
        filter: `name ~ ${query} || app_id ~ ${query}`,
        sort: "-created",
      });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  getProjectById: async (pb: Pocketbase, id: string) => {
    try {
      const data = await pb.collection("projects").getOne(id);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  getProjectByAppId: async (pb: Pocketbase, id: string) => {
    try {
      const data = await pb
        .collection("projects")
        .getFirstListItem(`app_id = "${id}"`);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  getProjectRoleByAppId: async (pb: Pocketbase, id: string) => {
    try {
      const user = get(currentUser);
      const data = await pb
        .collection("project_users")
        .getFirstListItem(`project.app_id = "${id}" && user.id = "${user?.id}"`);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  getProjectUsers: async (pb: Pocketbase, id: string) => {
    try {
      const data = await pb.collection("project_users").getFullList({
        filter: `project.id = "${id}"`,
        sort: "-created",
        expand: "user",
      });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  getUsersNotInProject: async (pb: Pocketbase, id: string) => {
    try {
      const { data: usersData, error: usersError } = await selectQueries.getAllUsers(pb);
      if (usersError || !usersData) {
        console.error(usersError);
        throw usersError;
      }

      const { data: projectUsersData, error: projectUsersError } = await selectQueries.getProjectUsers(pb, id);
      if (projectUsersError) {
        console.error(projectUsersError);
        throw projectUsersError;
      }

      const data = usersData.filter((user) => !projectUsersData?.find((projectUser) => projectUser.user.id === user.id));
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  getUserRoleByAppId: async (pb: Pocketbase, id: string, userId: string) => {
    try {
      const data = await pb
        .collection("project_users")
        .getFirstListItem(`project.app_id = "${id}" && user.id = "${userId}"`);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  // secrets
  getSecretsByProjectId: async (pb: Pocketbase, id: string) => {
    try {
      const data = await pb.collection("secrets").getFullList({
        filter: `project.app_id = "${id}"`,
        sort: "-created",
        expand: "project",
      });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};
