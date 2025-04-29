import { discoverContentPaths } from 'composably/content.loader';

export const entries = () => discoverContentPaths().map((path) => ({ path }));
