import type { PageServerLoad } from './$types';
import { loadPageContent, loadEntries } from '$lib/ssg/content.loader';

export const load: PageServerLoad = ({ params }) => loadPageContent(params.path);
export const entries = () => loadEntries().map((path) => ({ path }));
