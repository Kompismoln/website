import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { globSync } from 'node:fs';

/* not an actual test, just a playground so far */
describe('glob content', () => {
  it('finds page.yaml in content', () => {
    const contentDir = path.resolve(process.cwd(), 'src/lib/content');
    const pattern = path.join(contentDir, '**', 'page.@(yaml|md)');
    const files = globSync(pattern);
    const content = Object.fromEntries(
      files.map((file) => [path.dirname(path.relative(contentDir, file)), file])
    );
    console.log(content);
  });
});
