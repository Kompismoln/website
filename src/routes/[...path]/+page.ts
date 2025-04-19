import type { PageContent } from 'compis/types';
import type { PageLoad } from './$types';
import { resolvePage } from 'compis/component.loader';
import { setComponentMap } from 'compis/component.loader';

setComponentMap(import.meta.glob('$lib/components/**/*.svelte'));

export const load: PageLoad = async ({ data }) =>
  resolvePage(data as PageContent);
