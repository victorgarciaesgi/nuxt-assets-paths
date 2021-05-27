import { NuxtAssetsPathsOptions } from './types';

declare module '@nuxt/types' {
  interface NuxtConfig {
    assetsPaths?: NuxtAssetsPathsOptions;
  }
}
