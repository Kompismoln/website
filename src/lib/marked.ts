import { Marked, Renderer } from 'marked';
import { markedEmoji } from 'marked-emoji';
import markedFootnote from 'marked-footnote';
import markedAlert from 'marked-alert';
import emojis from '$lib/emojis/marked.json';
import config from '$lib/config';

export const createMarked = () => {
  const emojiOptions = {
    emojis,
    renderer: (token: any) =>
      `<img alt="${token.name}" src="${token.emoji}" class="marked-emoji-img">`
  };

  const variants = {
    default: 'fa-tree',
    base100: 'fa-seedling',
    base200: 'fa-dragon',
    base300: 'fa-cow',
    primary: 'fa-leaf',
    secondary: 'fa-wheat-awn',
    accent: 'fa-bomb',
    neutral: 'fa-leaf',
    info: 'fa-cloud',
    success: 'fa-rocket',
    warning: 'fa-hippo',
    error: 'fa-dumpster-fire'
  };

  const alertOptions = {
    className: 'alert',
    variants: Object.entries(variants).map(([type, icon]) => ({
      type,
      icon: `<i class="text-3xl fa-solid ${icon}"></i>`,
      title: ''
    }))
  };

  const renderer = new Renderer();
  renderer.heading = function ({ text, depth }) {
    return `<h${depth} class="text-primary">${text}</h${depth}>`;
  };
  renderer.em = function ({ text }) {
    return `<em class="text-accent">${text}</em>`;
  };
  renderer.checkbox = function ({ checked }) {
    return `<input class="checkbox checkbox-primary mr-2" ${checked ? 'checked' : ''} type="checkbox" />`;
  };
  renderer.link = function ({ href, title, text }) {
    const target = config.markdown.blank.test(href) ? '_blank' : '_self';
    return `<a
        href="${href}"
        title="${title || ''}"
        target="${target}"
        class="link text-accent hover:link-primary">
        ${text}
        </a>`;
  };

  const md = new Marked();

  md.use(markedEmoji(emojiOptions));
  md.use(markedAlert(alertOptions));
  md.use(markedFootnote());
  return { md, renderer };
};
