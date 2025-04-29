import { discoverContentPaths, setConfig } from 'composably/content.loader';
import config from '$lib/config';

setConfig(config.composably);

export const entries = () => discoverContentPaths().map((path) => ({ path }));
