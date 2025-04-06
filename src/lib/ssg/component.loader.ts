import type { ComponentMap } from '$lib/ssg/types';
import config from '$lib/config';

const componentMap = import.meta.glob('$components/**/*.svelte', {
  eager: true,
  import: 'default'
}) as ComponentMap;

export default function (name: string) {
  return componentMap[`/${config.componentRoot}/${name}.svelte`];
}
