import { discoverContentPaths } from 'composably';
import config from '$lib/config';

export const entries = () =>
  discoverContentPaths(config.composably).map((path) => ({ path }));
