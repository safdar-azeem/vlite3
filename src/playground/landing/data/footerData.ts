import type { FooterData } from '@/components/Footer/types'

export const footerData: FooterData = {
  brandName: 'vlite3',
  brandLogo: 'https://api.iconify.design/lucide:box.svg',
  brandDescription:
    'A lightweight, minimalistic Vue 3 UI component library built with Tailwind CSS v4.',
  badge: 'v1.2.5',
  copyright: 'Built with ❤️ by Safdar Azeem',
  socialLinks: [
    { icon: 'lucide:github', url: 'https://github.com/safdar-azeem' },
    { icon: 'lucide:twitter', url: '#' },
  ],
  linkGroups: [
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', url: '/components/getting-started' },
        { label: 'Components', url: '/components/button' },
        { label: 'GitHub', url: 'https://github.com/safdar-azeem/vlite3', external: true },
      ],
    },
    {
      title: 'Community',
      links: [
        { label: 'Issues', url: 'https://github.com/safdar-azeem/vlite3/issues', external: true },
        {
          label: 'Discussions',
          url: 'https://github.com/safdar-azeem/vlite3/discussions',
          external: true,
        },
        { label: 'NPM Package', url: 'https://www.npmjs.com/package/vlite3', external: true },
      ],
    },
  ],
}
