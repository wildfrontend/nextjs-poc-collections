
type LinkItem = {
  href: string;
  label: string;
};

type Section = {
  title: string;
  links: LinkItem[];
  subTitle?: string;
};

export const sections: Section[] = [
  {
    title: 'SVG vs Webp',
    links: [
      {
        href: '/svg-vs-webp/svg-in-image',
        label: 'Icon svg file import by next/image',
      },
      { href: '/svg-vs-webp/svg', label: 'Icon by svg' },
      { href: '/svg-vs-webp/webpx2', label: 'Icon by webp 48x48' },
    ],
    subTitle: 'Default',
  },
  {
    title: 'SVG vs Webp',
    links: [
      {
        href: '/svg-vs-webp/svg-in-image-loadmore',
        label: 'Icon svg file import by next/image',
      },
      { href: '/svg-vs-webp/svg-loadmore', label: 'Icon by svg' },
      { href: '/svg-vs-webp/webpx2-loadmore', label: 'Icon by webp 48x48' },
    ],
    subTitle: 'Load More',
  },
  {
    title: 'Image Optmize',
    links: [
      { href: '/image-optmize/next-image', label: 'Next Image' },
      {
        href: '/image-optmize/next-image-loadmore',
        label: 'Next Image Load More',
      },
    ],
  },
  {
    title: 'Third party optmize',
    links: [
      { href: '/third-party-optmize/origin', label: 'Default Third party' },
      { href: '/third-party-optmize/lazy-load', label: 'Lazy onload' },
    ],
  },
  {
    title: 'React-Query',
    links: [
      { href: '/react-query/products', label: 'Products' },
      {
        href: '/react-query/products/categories/smartphones/stories',
        label: 'Products - smartphones story',
      },
    ],
    subTitle: 'Products',
  },
  {
    title: 'Ant-Design',
    links: [{ href: '/antd', label: 'Antd - Dashboard' }],
  },
  {
    title: 'Slider LCP Performance',
    links: [
      { href: '/swiper', label: 'Swiper - default' },
      { href: '/swiper/performance', label: 'Swiper - performance' },
    ],
  },
  {
    title: 'Embeds Performance',
    links: [
      { href: '/media', label: 'Media - default' },
      { href: '/media/capture', label: 'Media - Capture' },
    ],
  },
  {
    title: 'Demo',
    links: [
      { href: '/demo/running-clock', label: 'Countdown 測試頁' },
      { href: '/demo/promise-lock', label: 'PromiseLock 測試頁' },
      { href: '/demo/3d-earth', label: '3D 地球 Demo' },
      { href: '/demo/voice-input', label: 'Voice Input Demo' },
    ],
  },
];
