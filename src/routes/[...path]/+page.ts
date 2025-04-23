import type { PageContent } from 'compis/types';
import type { PageLoad } from './$types';
import { resolvePage } from 'compis/component.loader';
import { setComponentMap } from 'compis/component.loader';

const svelteComponents = import.meta.glob('$lib/components/**/*.svelte');

setComponentMap(svelteComponents);

export const load: PageLoad = ({ data }) => resolvePage(data as PageContent);
