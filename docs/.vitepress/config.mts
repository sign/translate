import footnote from 'markdown-it-footnote';
import {withMermaid} from 'vitepress-plugin-mermaid';

import {defineConfig} from 'vitepress';

export default withMermaid(
  defineConfig({
    title: 'Documentation',
    description: 'sign.mt Documentation and Blog',
    base: '/docs/',
    themeConfig: {
      search: {
        provider: 'local',
      },
      editLink: {
        pattern: 'https://github.com/sign/translate/tree/main/docs/:path',
      },
      logo: '../assets/brand/logo.svg',

      sidebar: [
        {
          text: 'Fact Sheets',
          items: [
            {
              text: 'Numbers',
              link: '/facts/numbers',
              items: [
                {text: 'Hearing Loss', link: '/facts/numbers#hearing-loss'},
                {text: 'Deafness', link: '/facts/numbers#deafness'},
              ],
            },
            {
              text: 'Literacy',
              link: '/facts/literacy',
              items: [
                {text: 'Challenges', link: '/facts/literacy#challenges-and-causes'},
                {text: 'Statistics', link: '/facts/literacy#statistics'},
              ],
            },
          ],
        },
      ],

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
