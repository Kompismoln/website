import z from 'zod';

const ze = {
  component: (...cs: [string, ...string[]]) =>
    z
      .object({
        component: z.enum(cs)
      })
      .passthrough(),
  image: z.object({
    src: z.string(),
    alt: z.string()
  }),
  link: z.object({
    url: z.string(),
    text: z.string(),
    blank: z.boolean().optional()
  }),
  button: z.object({
    text: z.string(),
    url: z.string(),
    primary: z.boolean().optional()
  }),
  social: z.object({
    url: z.string(),
    platform: z.enum([
      'twitter',
      'facebook',
      'mastodon',
      'instagram',
      'youtube',
      'bluesky',
      'tiktok'
    ])
  })
};

export default ze;
