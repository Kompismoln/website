import { describe, it, expect, vi } from 'vitest';
import path from 'node:path';
import { globSync } from 'node:fs';
import { setComponentMap, getComponent } from './component.loader';
import { inferCommonPath } from './utils';

setComponentMap({
  'Basic.svelte': () => import('./test/components/Basic.svelte'),
  'WithSchema.svelte': () => import('./test/components/WithSchema.svelte')
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
      await expect(getComponent('NotAComponent')).rejects.toThrow(
        'Component not found: NotAComponent'
      );
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

describe('playground', () => {
  it('finds page.yaml in content', () => {
    const contentDir = path.resolve(process.cwd(), 'src/lib/content');
    const pattern = path.join(contentDir, '**', 'page.@(yaml|md)');
    const files = globSync(pattern);
    const content = Object.fromEntries(
      files.map((file) => [path.dirname(path.relative(contentDir, file)), file])
    );
  });
});
