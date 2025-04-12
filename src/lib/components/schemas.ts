/* Reusable schema chunks for component schemas */
import z from 'zod';

const image = () =>
  z.object({
    src: z.string(),
    alt: z.string()
  });

const link = () =>
  z.object({
    url: z.string(),
    text: z.string(),
    blank: z.boolean().optional()
  });

const button = () =>
  z.object({
    url: z.string(),
    text: z.string(),
    primary: z.boolean().optional()
  });

const social = () =>
  z.object({
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
  });

export default {
  image,
  link,
  button,
  social
};
