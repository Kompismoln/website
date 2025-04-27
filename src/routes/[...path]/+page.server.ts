import { discoverContentPaths } from 'compis/content.loader';

export const entries = () => discoverContentPaths().map((path) => ({ path }));
