import type { PageLoad } from './$types';
import content from 'virtual:content';

export const load: PageLoad = async ({ params }) => {
  const page = await content[params.path]();
  return page;
};
