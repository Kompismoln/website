---
title: "Dev diary: Content-first SSG in SvelteKit"
component: Blog/Post
date: 2025-04-20
dateString: Written April 20, 2025
_author: people/_alex.yaml
slots:
  evaluation:
    component: Swipe
    slides:
      - component: Card
        image:
          src: /images/undraw-server-error.svg
          alt: Undraw server error
        title: Sidenote downer
        description: >
          Attaching components post-rendering like this hurts client
          performance, and javascript-disabled clients wont load
          this at all :cry:

      - component: Card
        image:
          src: /images/undraw-designer.svg
          alt: Undraw designer
        title: Sidenote recovery
        description: >
          But the developer ergonomics is **phenomenal**! No more trying
          to style content in God's forsaken markdown parsers, just do it all in
          components.

      - component: Card
        image:
          src: /images/undraw-morning-workout.svg
          alt: Undraw morning workout
        title: All in all
        description: >
          - [x] Hugo-like content system: Achieved.


          - [ ] Frictionless shiny things compatibility: Promising
          but remains to be seen.

  simple-internet:
    component: Alert
    icon: fa-hippo
    theme: alert-info
    text: |
      Have you also wondered when making webites became difficult?
      Wasn't it easy once?

  treeshaking:
    component: Alert
    icon: fa-tree
    text: |
      Yes, it's lazy. Components pick what they need and the rest is treeshaked. Good times.

  alert-with-dragon:
    component: Alert
    icon: fa-dragon
    theme: alert-warning
    text: |
      Allt kommer bli bra.
---

Forgive me my stakeholders, but I have digressed. I was tasked to make a
website but have made a website-builder instead, which I intend to build
the website with, so it's not all lost.

The website is this one right here, and it needed something
simple and static but with all conveniences a design-illiterate backender
requires to make a fun and tolerable website. I can _not_ conjure a website
on the spot so I need tools to
play with. TailwindCSS, DaisyUI, Swiper, Animate.CSS... Throw them all in.

And since new tools are coming in every hour, kompismoln.se should be able to
gracefully accept a steady stream of mixed bags, and work with them without friction.

- [x] Lots of new shiny stuff
- [x] No friction

These two are known to be mutually exclusive, so let's put SvelteKit to the
test. Also, a content system like Hugo would be nice, it made content editing
a breeze when I last worked with it.

So the requirements boiled down to this: The usual SvelteKit boilerplate with a
shameless amount of frontend helpers and with a content system like Hugo.

## Research

Surely I'll be able to find this in the wild somewhere.
(I wasn't).

![asdf](/images/mdsvex-everywhere.jpg)

Ask your favorite LLM, search "markdown sveltekit" or run `npx sk create`, they'll
convince you in unison: mdsvex is the way in all things markdown. But is it really?

Mdsvex [^2] is a tool that lets me write markdown instead of html in components.
This sounds like fun, but I only need a renderer.
Also, what happened to
[^2]: https://mdsvex.pngwn.io/docs

> Keep content and code separate

Don't we do that anymore?
Or am I missing something?

After some tinkering to figure out what's going on, the findings
are still inconclusive. Not sure if they see components as code or content,
or if its just very nice to have markdown in your components instead
of html, I'm confused.
Either way, it doesn't seem to bring me any closer to being Hugo-like
than just using remark.

I adjusted my search methods accordingly and scolded my LLMs for ignoring
subtleties but the lack of meaningful results persisted, no Hugo-like
content-first SvelteKit set ups as far as the eye could see.

## Building

So after much research and testing I concluded that if I want this, I'll have
to build it, which I did, and get this:

As we know, SvelteKit components are little isolated pieces of website that
undergo some deep svelte magic to become transient server/client beings. But
they're also a module, so if I define a schema in some component that takes
text and number:

```html
<script module>
  import z from 'zod';

  export const schema = z.object({
    number: z.number(),
    text: z.string()
  });
</script>

<script lang="ts">
  let { number, text } = $props();
  ...
</script>
...
```

We get a co-located schema while also being able to import this schema
server-side for validation. This is good, but there's an extra dependency and a
new unfamiliar block in all components now, which is bad. So let me tip the
scale by informing you that zod has transformations that can be used to
to create complex and decisive types: [^1]

[^1]:
    All snippets are figments, project lives in
    https://github.com/kompismoln/website.

```typescript
const content = (obj: any) => {
  return z
    .object({ ...obj, component: z.string() })
    .strict()
    .transform((val) => process(val as ComponentContent));
};

const markdown = (options = {}) => {
  const prepare = (val: string): PreparedMarkdown => ({
    markdown: val,
    options
  });
  return z.string().transform(prepare).or(parsedHtml());
};
```

Now expose them in a friendly way so that the components can enjoy
increasingly expressive schemas while verbosity remains minimal:

```html
<script module>
  import { z, c } from 'composably/schema';
  import { s } from './my-cms-schemas';

  export const schema = c.content({
    image: s.image(),
    text: z.string(),
    body: c.markdown()
  });
</script>
```

The body-field can now, in addition to being validated, also be identified as
markdown and parsed to html on the server before being sent to bundle, just
like with Hugo. And now that all components can present themselves to the
server properly, they can be specified in content instead of code.

- [x] Content-first


:::slot{#simple-internet}

> Have you also wondered when making websites became difficult? Wasn't it easy
> once?
> :::

Look at this structured content:

```plain
---
component: Blog/Post
date: 2025-04-21
title: Modern frontend is a wonder
---
Forgive me my stakeholders, but I have digressed...
```

It has a conveyor belt right up to its component now:

1. Find all `component` attributes in page content
2. Validate and transform with their own schema
3. Pass to client which replaces data with imported module
4. Render in parent (component or page)

We can even get rid of explicit imports, the component
`Blog/Post.svelte` can be fetched from a dynamic map of all components
that we create with vite's glob import. And even though the import is statically
replaced before runtime and so behaves somewhat unusual,
the result is ultimately a value that can be passed around:

```javascript
setComponentMap(import.meta.glob('$lib/components/**/*.svelte'));
```

Thanks Vite for this lazy component map that works identically on server and
client somehow.

:::slot{#treeshaking}
Yes, it's lazy. Components are picked by those needed and the rest is treeshaked. Good times.
:::

Let's just pop the component name and pass the rest of the
properties and we have a renderable component & props thingy to pass to the
component.

```typescript
export const resolveComponent = async (
  content: ComponentContent
): ResolvedComponent => {
  const { component: name, ...props } = content;
  const { default: component } = await getComponent(name);

  return {
    component: await component,
    props
  };
};
```

Now that we have a component resolver at our disposal,
we can go to `[...path]` and have `+page.server.ts`
focusing on loading the page content:

```typescript
import type { PageServerLoad } from './$types';
import {
  loadPageContent,
  discoverContentPaths
} from 'composably/content.loader';

export const load: PageServerLoad = async ({ params }) =>
  await loadPageContent(params.path);

export const entries = () => discoverContentPaths().map((path) => ({ path }));
```

And the `+page.ts` can import the component module after the content data has crossed
the boundary:

```typescript
import type { PageContent } from 'composably/types';
import type { PageLoad } from './$types';
import { resolvePage } from 'composably/component.loader';

export const load: PageLoad = async ({ data }) =>
  resolvePage(data as PageContent);
```

From here, the component can be inserted just like statically imported
components, because Svelte apparently has dynamic components by default now:

```html
<section class="flex items-center">
  <author.component {...author.props} />
</section>
```

Last part we made promising strides to the _Hugo-like_ part of the requirement.
Now let's think about how we can ensure stable flexibility with a variety of graphical tools.
SvelteKit already gives us isolated components to play in, and the treeshaking is known
to be trustworthy, this alone is pretty neat, but remember _components in
markdown_? I want that, but without mixing content and code. Let's do a hack for now
just to establish an API and get back to a more solid solution another time.

We can use
[`remark-directive`](https://github.com/remarkjs/remark-directive)
to parse placeholder tags for us, think markdown like this:

```markdown
:::slot{#alert-with-dragon}
Hello non-javascript user.
Picture an alert with a font awesome dragon that tells you everything will be alright in swedish.
:::
```

To get this placeholer element in html:

```html
<div data-slot="alert-with-dragon">
  Hello non-javascript user. Picture an alert with a font awesome dragon that
  tells you everything will be alright in swedish.
</div>
```

Then we can mount **and** hydrate slots from content in the frontend straight
up:

```typescript
import { hydrate } from 'svelte';
import { browser } from '$app/environment';

if (browser) {
  for (const key in slots) {
    const { component, props } = slots[key];
    const target = document.querySelector(`[data-slot="${key}"]`);

    if (target) {
      target.innerHTML = '';
      hydrate(component, { target, props });
    }
  }
}
```

Javascript-enabled clients, behold:
:::slot{#alert-with-dragon}
Hello non-javascript user.
Picture an alert with a font awesome dragon that tells you everything will be alright in swedish.
:::

## Conclusion

The content author (incidentally me) can now pull in graphical elements all
day, while the developer (also me) can focus on more important things like
solving sudokus.

:::slot{#evaluation}
:::
