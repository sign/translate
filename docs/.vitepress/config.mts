import footnote from 'markdown-it-footnote';
import {withMermaid} from 'vitepress-plugin-mermaid';

import {defineConfig} from 'vitepress';

export default withMermaid(
  defineConfig({
    title: 'Documentation',
    description: 'sign.mt Documentation and Blog',
    base: '/docs/',
    lastUpdated: true,
    sitemap: {
      hostname: 'https://sign.mt/docs/',
    },
    themeConfig: {
      search: {
        provider: 'local',
      },
      editLink: {
        pattern: 'https://github.com/sign/translate/tree/master/docs/:path',
      },
      logo: {
        light: '/logo-light.svg',
        dark: '/logo-dark.svg',
        alt: 'sign.mt Logo',
      },
      nav: [
        {text: 'Docs', link: '/docs/introduction/getting-started'},
        {text: 'Blog', link: '/blog/introduction/our-blog'},
      ],
      sidebar: {
        '/blog/': [
          {
            text: 'Introduction',
            items: [
              {
                text: 'Our Blog',
                link: '/blog/introduction/our-blog',
              },
            ],
          },
        ],
        '/docs/': [
          {
            text: 'Introduction',
            items: [
              {
                text: 'Getting Started',
                link: '/docs/introduction/getting-started',
              },
            ],
          },
          {
            text: 'Technology',
            collapsed: false,
            items: [
              {
                text: 'Our Approach',
                link: '/docs/technology/introduction',
              },
              {
                text: 'Reviews & Awards',
                link: '/docs/technology/awards',
              },
            ],
          },
          {
            text: 'Fact Sheets',
            collapsed: false,
            items: [
              {
                text: 'Population',
                link: '/docs/facts/population',
                items: [
                  {text: 'Hearing Loss', link: '/docs/facts/population#hearing-loss'},
                  {text: 'Deafness', link: '/docs/facts/population#deafness'},
                  {text: 'Interpreters', link: '/docs/facts/population#sign-language-interpreters'},
                ],
              },
              {
                text: 'Literacy',
                link: '/docs/facts/literacy',
                items: [
                  {text: 'Challenges', link: '/docs/facts/literacy#challenges-and-causes'},
                  {text: 'Statistics', link: '/docs/facts/literacy#statistics'},
                ],
              },
              {
                text: 'Market',
                link: '/docs/facts/market',
                items: [
                  {text: 'Economic Impact', link: '/docs/facts/market#economic-impact'},
                  {text: 'Perception', link: '/docs/facts/market#perception-and-impact'},
                  {text: 'U.S. Segments', link: '/docs/facts/market#market-segments-in-the-united-states'},
                  {text: 'Consumer Products', link: '/docs/facts/market#consumer-products-and-services'},
                ],
              },
            ],
          },
          {
            text: 'Regulation',
            collapsed: true,
            items: [
              {
                text: 'The United States',
                link: '/docs/regulation/united-states',
              },
              {
                text: 'The European Union',
                link: '/docs/regulation/european-union',
              },
              {
                text: 'Switzerland',
                link: '/docs/regulation/switzerland',
              },
            ],
          },
          {
            text: 'Companies',
            collapsed: false,
            items: [
              {
                text: 'Sign Language Companies',
                link: '/docs/companies/sign-language-companies',
              },
              {
                text: 'State of the Art',
                link: '/docs/companies/state-of-the-art',
                items: [
                  {text: 'Spoken to Signed', link: '/docs/companies/state-of-the-art#spoken-to-signed-translation'},
                  {text: 'Signed to Spoken', link: '/docs/companies/state-of-the-art#signed-to-spoken-translation'},
                ],
              },
              {
                text: 'Other Projects',
                link: '/docs/companies/other-projects',
              },
            ],
          },
        ],
      },

      socialLinks: [
        {icon: 'github', link: 'https://github.com/sign/translate'},
        {icon: 'x', link: 'https://x.com/signmt_'},
        {icon: 'linkedin', link: 'https://www.linkedin.com/company/sign-mt'},
      ],
    },
    head: [
      ['script', {async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-87YJPM7261'}],
      [
        'script',
        {},
        `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-87YJPM7261');`,
      ],
    ],
    markdown: {
      config: md => {
        md.use(footnote);
      },
    },
  })
);
