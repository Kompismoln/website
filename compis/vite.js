import { parse } from './markdown';
import { virtualComponentMap } from './component.loader';

export default function composably() {

  return {
    name: 'composably',

    async transform(code, id) {
      if (!id.endsWith('.md')) return;

      const html = await parse(code);

      return {
        code: html,
        map: null
      };
    },

    async load(id) {
      if (id === 'virtual:component-map') {
        return `
          export const vmap = {
            ${Object.keys(virtualComponentMap).map(h => `'${h}': () => import('virtual:${h}')`).join(',\n')}
          };
        `;
      };
      if (id.startsWith('virtual:')) {
        return id;
      }
    },

    resolveId(source) {
      if (source.startsWith('virtual:')) {
        console.log(source)
        return source;
      }
    },

  };
}

// Helper to create a Svelte component from HTML and slot references
function createSvelteComponent(html, slotReferences, componentMap) {
  // Create import statements for the components
  const imports = Object.entries(slotReferences).map(([slotId, componentName]) => {
    // Map the component name to its import path
    const importPath = componentMap[componentName] || `../components/${componentName}.svelte`;
    // Generate a valid JS variable name from the slot ID
    const varName = slotId.replace(/-/g, '_');

    return `import ${varName} from '${importPath}';`;
  }).join('\n');

  // Replace slot placeholders with Svelte component instantiation
  const processedHtml = html.replace(
    /<div data-slot="([^"]+)"[^>]*>([\s\S]*?)<\/div>/g, 
    (match, slotId, fallbackContent) => {
      const varName = slotId.replace(/-/g, '_');
      return `<${varName} />`;
    }
  );

  // Create the full Svelte component source
  const source = `
<script>
${imports}
</script>

${processedHtml}
`;

  return source;
}

// Extract slot references from HTML
function extractSlotReferences(html) {
  const slotRefs = {};
  const slotRegex = /<div data-slot="([^"]+)"[^>]*data-component="([^"]+)"[^>]*>/g;
  let match;

  while ((match = slotRegex.exec(html)) !== null) {
    const [_, slotId, componentName] = match;
    slotRefs[slotId] = componentName;
  }

  return slotRefs;
}
