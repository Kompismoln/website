import type { PageLoad } from './$types';
import content from 'composably:content';

export const load: PageLoad = async ({ params }) => {
  let { default: page } = await content[params.path]();
  return await page();
};
