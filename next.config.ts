import type { NextConfig } from 'next';

import envVariable from './config/env';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    // 找出處理 SVG 的原本規則
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.svg')
    );

    if (fileLoaderRule) {
      config.module.rules.push(
        // 只處理 *.svg?url
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/,
        },
        // 其他 SVG 轉成 React Component
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [/url/] },
          use: ['@svgr/webpack'],
        }
      );

      // 原本的 fileLoader 不處理 SVG
      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },

  images: {
    deviceSizes: [375, 500, 600, 700, 960, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { hostname: 'static.gosugamers.net' },
      { hostname: 'static.staging.gosugamers.net' },
      { hostname: 'i.ytimg.com' },
      { hostname: 'static-cdn.jtvnw.net' },
      { hostname: 'img.daisyui.com' },
      { hostname: 'cdn.dummyjson.com' },
      { hostname: 'fastly.picsum.photos' },
    ],
  },

  env: envVariable,

  experimental: {
    nextScriptWorkers: true,
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
