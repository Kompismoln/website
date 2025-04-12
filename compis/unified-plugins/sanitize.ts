import sanitize, { defaultSchema } from 'rehype-sanitize';
import type { Schema } from 'hast-util-sanitize';

// Allow using `role` and `aria-label` attributes in transformed HTML document
const schema = structuredClone(defaultSchema) as Schema;
schema.attributes ??= {}; // Keep the linter happy
if ('span' in schema.attributes) {
  schema.attributes.span.push('role', 'ariaLabel');
} else {
  schema.attributes.span = ['role', 'ariaLabel'];
}
