import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { loadPageContent, loadEntries } from '$lib/ssg/content.loader';

export const load: PageServerLoad = async ({ params }) => {
  let content = await loadPageContent(params.path);
  return content ?? error(404, params.path);
};

export const entries = async () => loadEntries('path');
