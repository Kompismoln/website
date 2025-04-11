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

  const alertOptions = {
    className: 'alert',
      variants: [
    {
      type: 'primary',
      icon: '<i class="text-3xl fa-solid fa-leaf"></i>',
      title: '',
    },
    {
      type: 'secondary',
      icon: '<i class="text-3xl fa-solid fa-wheat-awn"></i>',
      title: '',
    },
    {
      type: 'accent',
      icon: '<i class="text-3xl fa-solid fa-bomb"></i>',
      title: '',
    },
    {
      type: 'info',
      icon: '<i class="text-3xl fa-solid fa-cloud"></i>',
      title: '',
    },
    {
      type: 'success',
      icon: '<i class="text-3xl fa-solid fa-rocket"></i>',
      title: '',
    },
    {
      type: 'warning',
      icon: '<i class="text-3xl fa-solid fa-hippo"></i>',
      title: '',
    },
    {
      type: 'error',
      icon: '<i class="text-3xl fa-solid fa-dumpster-fire"></i>',
      title: '',
    },
  ]
  };

  const renderer = new Renderer();
  renderer.heading = function ({ text, depth }) {
    return `<h${depth} class="text-primary">${text}</h${depth}>`;
  };
  renderer.em = function ({ text }) {
    return `<em class="text-accent">${text}</em>`;
  };
  renderer.checkbox = function ({ checked }) {
    return `<input class="checkbox checkbox-primary mr-2" ${checked ? "checked" : ""} type="checkbox" />`;
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
