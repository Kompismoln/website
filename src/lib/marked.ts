import { Marked, Renderer } from 'marked';
import { markedEmoji } from 'marked-emoji';
import markedFootnote from 'marked-footnote';
import markedAlert from 'marked-alert';
import customHeadingId from 'marked-custom-heading-id';
import emojis from '$lib/emojis/marked.json';

export const createMarked = () => {
  const options = {
    emojis,
    renderer: (token: any) =>
      `<img alt="${token.name}" src="${token.emoji}" class="marked-emoji-img">`
  };
  const renderer = new Renderer();
  const md = new Marked();

  md.use(markedEmoji(options));
  md.use(markedAlert());
  md.use(customHeadingId());
  md.use(markedFootnote());
  return { md, renderer };
};
