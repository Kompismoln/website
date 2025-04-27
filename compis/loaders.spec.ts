import { describe, it, expect, vi } from 'vitest';
import path from 'node:path';
import { globSync } from 'node:fs';
import { setComponentMap, getComponent } from './component.loader';
import { inferCommonPath } from './utils';
import { collectPage } from './content.loader';
import { c } from './schemas';


setComponentMap({
  'Basic.svelte': () => import('./test/components/Basic.svelte'),
  'WithSchema.svelte': () => import('./test/components/WithSchema.svelte')
});

describe('validate content', async () => {
  const code = `
  import c from '$lib/components/schemas';

  export const schema = c.content({
    primer: c.string(),
    body: c.markdown(),
    buttons: c.array(c.button()).max(2)
  });
`;
  it('parses schema', async () => {
    expect(c.content({})).toBeDefined();
    expect(c.string()).toBeDefined();
    expect(c.asdf).toBeUndefined();
    expect(c.markdown).toBeTruthy();
    expect(c.smarkdown).toBeFalsy();
  });
});

/*
import getPlugin from './vite';

describe('load pages', async () => {
  it('collects pages', async () => {
    const page = await collectPage('blog');
    console.log(page);
  });
});

describe('transform hook playground', async () => {
  const plugin = await getPlugin();
  const transform = plugin.transform!.bind(plugin);

  it('play with random code', async () => {
    const code = `
      <script module>
        export const shape = { hello: 'world' };
      </script>
      <h1>Hello</h1>
    `;
    const id = '/src/lib/TestComponent.svelte';

    const result = await transform(code, id);
    console.log('TRANSFORM RESULT', result);
    // no assertions, just playground
  });
});
describe('components', () => {
  it('infers component root correctly', () => {
    const paths = [
      [[], ''],
      [['asd.f'], ''],
      [['asdf.a', 'asdf.b'], ''],
      [['/asdf.a', 'asdf.b'], ''],
      [['/asdf.a', '/asdf.b'], '/'],
      [['asd/f.a', 'asd/f.b'], 'asd/'],
      [['/asdf/asd/f.a', '/asdf/asd/f.b'], '/asdf/asd/']
    ];

    paths.forEach(([p, r]) => {
      expect(inferCommonPath(p as any)).eq(r);
    });
  }),
    it('retrieves components', async () => {
      //await expect(getComponent('NotAComponent')).rejects.toThrow(
      //  'Component not found: NotAComponent'
      //);
      const { default: component, schema } = await getComponent('WithSchema');
      let result: any;

      result = await schema.safeParseAsync({});
      expect(result.success, result.error).toBeFalsy();

      result = await schema.safeParseAsync({
        component: 'WithSchema',
        theme: 'asdf',
        icon: 'asdf',
        text: 'asdf'
      });
      expect(result.success, result.error).toBeTruthy();
    });
});

*/
describe('playground', () => {
  it('finds page.yaml in content', () => {
    const c = { test: 'asdff' };
    const r = (new Function('c', `return c.test`))(c);
    console.log(r);
  });
});
