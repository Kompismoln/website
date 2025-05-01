import { discoverContentPaths, setConfig } from 'composably';
import config from '$lib/config';

setConfig(config.composably);

export const entries = () => discoverContentPaths().map((path) => ({ path }));
