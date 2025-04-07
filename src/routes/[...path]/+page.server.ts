import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { siteContent, loadPageContent } from '$lib/ssg/content.loader';

export const load: PageServerLoad = async ({ params }) => {
  let content;

  if (process.env.NODE_ENV === 'development') {
    content = await loadPageContent(params.path);
  } else {
    content = siteContent[params.path];
  }
  return content ?? error(404, params.path);
};

export const entries = async () => Object.keys(siteContent).map((p) => ({ path: p }));
