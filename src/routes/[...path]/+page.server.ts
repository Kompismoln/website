import type { PageServerLoad } from './$types';
import { loadPageContent, discoverContentPaths } from 'compis/content.loader';

export const load: PageServerLoad = ({ params }) =>
  loadPageContent(params.path);

export const entries = () => discoverContentPaths().map((path) => ({ path }));
