# 🌆 🖇 Nuxt assets paths

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![npm downloads][npm-total-downloads-src]][npm-downloads-href]
<img src='https://img.shields.io/npm/l/simple-graphql-to-typescript.svg'>

[npm-version-src]: https://img.shields.io/npm/v/nuxt-assets-paths.svg
[npm-version-href]: https://www.npmjs.com/package/nuxt-assets-paths
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-assets-paths.svg
[npm-total-downloads-src]: https://img.shields.io/npm/dt/nuxt-assets-paths.svg
[npm-downloads-href]: https://www.npmjs.com/package/nuxt-assets-paths

## Generate icon paths objects and Typescript interface for your assets and static files

Typescript is recommanded for this module usage

# Installation

```bash
yarn add -D nuxt-assets-paths

#or
npm install -D nuxt-assets-paths
```

# Configuration

First, register the module in the `nuxt.config.[js|ts]`

```javascript
const config = {
  ...,
  modules: [
    'nuxt-assets-paths',
  ]
}
```

In your nuxt.config

```javascript
import 'nuxt-assets-paths';

export default {
  assetsPaths: {
    // Options
  },
};
```

Options:

```ts
export interface NuxtAssetsPathsOptions {
  //
  /**
   * Path to where you cant the file to be saved (ex: "./src/models/assets.ts")
   * @default "<srcDir>/__assetsPaths.ts"
   */
  filePath?: string;

  /** Name of the routesNames object in the generated file (ex: "routesTree")
   * @default "assetsPaths"
   * */
  pathsObjectName?: string;

  /**
   * Enables static files paths generation
   * @default false */
  staticPaths?: boolean;
}
```

# Usage in Vue/Nuxt

## - `assetsPaths` global object

At build , the module will create a file with the global object of the assets paths inside.

### _Usage_

Given this structure

    ├── assets
        ├── icons
            ├── actions
                ├── done.png
                ├── done.svg
            ├── home.svg
        └── images
            ├── background.svg
            ├── flower.webp
    └── ...

The generated file will look like this

```javascript
export const assetsPaths = {
  icons: {
    actions: {
      done_png: '~assets/icons/actions/done.png',
      done_svg: '~assets/icons/actions/done.svg',
    },
    home: '~assets/icons/home.svg',
  },
  images: {
    background: '~assets/images/background.svg',
    flower: '~assets/images/flower.webp',
  },
};
export type AssetsPaths =
  | '~assets/icons/actions/done.png'
  | '~assets/icons/actions/done.svg'
  | '~assets/icons/home.svg'
  | '~assets/images/background.svg'
  | '~assets/images/flower.webp';
```

You can now just import it

```vue
<template>
  <img :src="assetsPaths.actions.done_svg" />
</template>
```

```javascript
import { assetsPaths } from '~/models/assetsPaths.ts';

export default {
  data: () => ({
    assetsPaths,
  }),
};
```

And type your component props (Volar recommanded in VSCode)

```ts
import { Proptype } from 'vue';
import { AssetsPaths } from '...yourPath/__assetsPaths';

export default defineComponent({
  name: 'Image',
  props: {
    src: { type: String as PropType<AssetsPaths> },
  },
});
```

## Advanced usage (for Typescript users)

Create a plugin `nuxt-assets-paths.ts`, and register it in your nuxt.config.js

```js
import { assetsPaths } from '...your file path';

export default (ctx, inject) => {
  inject('assets', assetsPaths);
};
```

Then create shims a file in `~/shims/nuxt.d.ts`

```ts
import { assetsPaths } from '...your file path';

declare module 'vue/types/vue' {
  interface Vue {
    $assets: typeof assetsPaths;
  }
}
```

You will now have `$assets` exposed in all your component without importing it and it will be typed automaticaly!

```vue
<template>
  <img :src="$assets.actions.done_svg" />
</template>
```

## Development

1. Clone this repository
2. Install dependencies using `yarn` or `npm install`

## 📑 License

[MIT License](./LICENSE)
