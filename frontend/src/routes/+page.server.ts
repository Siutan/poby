import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { selectQueries } from "$lib/queries/pbSelect";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  if (!locals.user) {
    redirect(303, "/auth/login");
  }

  const { data, error } = await selectQueries.getAllProjects(locals.pb);
  if (error) {
    console.error(error);
  }
  return {
    projects: data || [],
  };
};
