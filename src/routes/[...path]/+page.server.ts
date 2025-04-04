import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { siteContent } from '$lib/content/index';

export const load: PageServerLoad = async ({ params }) =>
  siteContent[params.path] ?? error(404, params.path);

export const entries = async () =>
  Object.keys(siteContent).map((p) => ({ path: p }));
