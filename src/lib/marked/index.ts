import { Marked, Renderer } from 'marked';
import type { Token } from 'marked';
import { markedEmoji } from 'marked-emoji';
import markedFootnote from 'marked-footnote';
import markedAlert from 'marked-alert';
import extendedTables from 'marked-extended-tables';
import emojis from '$lib/marked/emojis.json';
import config from '$lib/config';

export const createMarked = () => {
  const plustag = {
    name: 'plugtag',
    level: 'inline',
    start(src: string) { return src.indexOf('+['); },
    tokenizer(src: string, tokens: any) {
      const rule = /^\+\[(.*?)\]\((.*?)\)/;
      const match = rule.exec(src);
      if (match) {
        const token = {
          type: 'plustag',
          raw: match[0],
          text: match[1],
          href: match[2],
        };
      }
      return false;
    }
  };

  const walkTokens = (token: Token) => {
    if (token.type === 'heading') {
      token.depth += 1;
    }
  };

  const emojiOptions = {
    emojis,
    renderer: (token: any) =>
      `<img alt="${token.name}" src="${token.emoji}" class="marked-emoji-img">`
  };

  const variants = {
    default: 'fa-tree',
    base100: 'fa-seedling',
    base200: 'fa-hippo',
    base300: 'fa-cloud',
    primary: 'fa-leaf',
    secondary: 'fa-wheat-awn',
    accent: 'fa-bomb',
    neutral: 'fa-leaf',
    info: 'fa-cow',
    success: 'fa-rocket',
    warning: 'fa-dragon',
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
  md.use(extendedTables());
  md.use({ walkTokens });
  return { md, renderer };
};
