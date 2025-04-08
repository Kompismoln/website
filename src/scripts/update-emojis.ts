import { Octokit } from '@octokit/rest';
import { writeFile } from 'fs/promises';
import { mkdir } from 'fs/promises';
import path from 'path';

async function updateEmojis() {
  const octokit = new Octokit();
  const res = await octokit.rest.emojis.get();
  const emojis = res.data;

  const outDir = path.resolve('src/lib/emojis');
  const outFile = path.join(outDir, 'marked.json');

  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, JSON.stringify(emojis, null, 2));

  console.log(`✅ Emoji data saved to ${outFile}`);
}

updateEmojis().catch((err) => {
  console.error('❌ Failed to update emojis:', err);
  process.exit(1);
});
