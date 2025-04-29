export default {
  siteName: 'Kompismoln',
  siteUrl: 'https://kompismoln.se',
  siteDescription:
    'A cloud agency with a focus on DIY, education, decentralization and sustainability',
  logo: {
    src: '/images/kompismoln-logo.svg',
    alt: 'kompismoln-logo'
  },
  searchPage: false,
  // Don't forget to sync first value with fallback in app.html
  themes: ['dark', 'light'],
  markdown: {
    blank: /^(http|https|ftp|mailto|tel|file|data|ws|wss|irc|git):/i
  },
  menu: [
    { text: 'Blogg', url: '/blog/hugo-like-sveltekit-ssg' },
    { text: 'Logga in', url: 'https://nc.kompismoln.se' }
  ],
  license:
    'Copyright © 2025 kompismoln. Concept copyrighted but code & design is free to use (MIT)',
  socials: [
    { platform: 'twitter', url: 'http://example.com' },
    { platform: 'instagram', url: 'http://example.com' },
    { platform: 'youtube', url: 'http://example.com' },
    { platform: 'facebook', url: 'http://example.com' },
    { platform: 'bluesky', url: 'http://example.com' },
    { platform: 'tiktok', url: 'http://example.com' },
    { platform: 'mastodon', url: 'http://example.com' }
  ],
  composably: {
    componentRoot: 'src/lib/components',
    contentRoot: 'src/lib/content',
    indexFile: 'index'
  }
};
