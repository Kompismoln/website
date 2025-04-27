import type { PageContent } from 'compis/types';
import type { PageLoad } from './$types';
import { resolvePage } from 'compis/component.loader';
import { setComponentMap } from 'compis/component.loader';
import content from 'virtual:content';

const svelteComponents = import.meta.glob('$lib/components/**/*.svelte');

setComponentMap(svelteComponents);

export const load: PageLoad = async ({ params, data }) => {
  let { default: newPage } = await content[params.path]();
  console.log((await newPage()));
  const page = resolvePage(data as PageContent);
  return page;
}
