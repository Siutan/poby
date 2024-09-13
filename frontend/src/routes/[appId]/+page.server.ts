import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { selectQueries } from "$lib/queries/pbSelect";

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user) {
    redirect(303, "/auth/login");
  }

  const appId = params.appId;

  const { data: project, error: projectError } = await selectQueries.getProjectByAppId(locals.pb, appId);

  if (projectError || !project) {
    console.error(projectError);
  }

  const { data: projectRole, error: projectRoleError } = await selectQueries.getProjectRoleByAppId(locals.pb, appId);

  if (projectRoleError || !projectRole) {
    console.error(projectRoleError);
  }

  const { data, error } = await selectQueries.getSecretsByProjectId(locals.pb, appId);
  if (error) {
    console.error(error);
  }
  return {
    project: project,
    secrets: data || [],
    appId: appId,
    projectRole: projectRole,
  };
};
