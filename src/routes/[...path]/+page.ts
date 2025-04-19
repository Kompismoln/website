import type { PageContent } from 'compis/types';
import type { PageLoad } from './$types';
import { resolvePage } from 'compis/component.loader';

export const load: PageLoad = async ({ data }) =>
  resolvePage(data as PageContent);
