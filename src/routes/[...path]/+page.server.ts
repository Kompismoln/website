import type { PageServerLoad } from './$types';
import { loadPageContent, discoverContentPaths } from 'compis/content.loader';

export const load: PageServerLoad = async ({ params }) =>
  await loadPageContent(params.path);

export const entries = () => discoverContentPaths().map((path) => ({ path }));
