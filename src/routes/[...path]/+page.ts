import type { PageLoad } from './$types.d.ts';
import content from 'composably:content';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
  try {
    const page = await content(params.path);
    return page;
  } catch (e) {
    console.error(e);
    error(404, { message: `No content file found in: '${params.path}'` });
  }
};
