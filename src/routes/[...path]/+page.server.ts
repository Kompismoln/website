import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import content from '$lib/ssg/content.loader';

export const load: PageServerLoad = async ({ params }) =>
  content[params.path] ?? error(404, params.path);

export const entries = async () => Object.keys(content).map((p) => ({ path: p }));
