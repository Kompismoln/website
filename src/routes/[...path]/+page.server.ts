import type { PageServerLoad } from './$types';
import { loadPageContent, discoverContentPaths } from 'compis/content.loader';

export const load: PageServerLoad = async ({ params }) => {
  const page = await loadPageContent(params.path);
  return page;
};

export const entries = () => discoverContentPaths().map((path) => ({ path }));
