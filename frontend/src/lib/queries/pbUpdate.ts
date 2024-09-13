import type { RecordModel } from "pocketbase";
import type Pocketbase from "pocketbase";

type UpdateProjectData = {
  name: string;
  active: boolean;
};

export const updateQueries = {
  // org
  updateOrg: async (pb: Pocketbase, id: string, data: RecordModel) => {
    try {
      const org = await pb.collection("organisation").update(id, data);
      return { data: org, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  //roles
  updateProjectRole: async (pb: Pocketbase, id: string, data: RecordModel) => {
    try {
      const projectUser = await pb.collection("project_users").update(id, data);
      return { data: projectUser, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  // projects
  updateProjectName: async (
    pb: Pocketbase,
    id: string,
    data: UpdateProjectData
  ) => {
    try {
      const project = await pb.collection("projects").update(id, data);
      return { data: project, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  toggleProjectStatus: async (
    pb: Pocketbase,
    id: string,
    active: boolean
  ) => {
    try {
      const project = await pb.collection('projects').update(id, {active});
      return { data: project, error: null}
    } catch (error) {
      return {data: null, error: error}
    }
  },
  // secrets
  updateSecret: async (pb: Pocketbase, id: string, data: { notes: string }) => {
    try {
      const secret = await pb.collection("secrets").update(id, data);
      return { data: secret, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};
