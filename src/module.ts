import { Module } from '@nuxt/types';
import chalk from 'chalk';
import { capitalize } from 'lodash';
import path from 'path';
import { saveFile } from './save';
import { NuxtAssetsPathsOptions } from './types';
import { processAssetDir } from './utils';

const assetsPathsModule: Module<NuxtAssetsPathsOptions> = function (moduleOptions) {
  try {
    const {
      filePath = `${this.options.srcDir}/__assetsPaths.ts`,
      pathsObjectName = 'assetsPaths',
      staticPaths = true,
    }: NuxtAssetsPathsOptions = { ...this.options.assetsPaths, ...moduleOptions };

    const assetsFolderPath = path.resolve(process.cwd(), `${this.options.srcDir}/assets/`);
    const staticFolderPaths = path.resolve(process.cwd(), `${this.options.srcDir}/static/`);

    const extension = filePath.split('.').pop();

    this.nuxt.hook('build:before', async () => {
      let outObject = `export const ${pathsObjectName} = {`;
      let interfaceType = 'export type AssetsPaths = ';
      let generatedOutput = await processAssetDir(
        assetsFolderPath,
        '~assets/',
        outObject,
        interfaceType,
        extension
      );
      if (staticPaths) {
        let staticInterfaceType = 'export type StaticAssetsPaths = ';
        const staticOutObject = `export const static${capitalize(pathsObjectName)} = {`;
        const staticGeneratedOutput = await processAssetDir(
          staticFolderPaths,
          '/',
          staticOutObject,
          staticInterfaceType,
          extension
        );
        generatedOutput += `\n\n${staticGeneratedOutput}`;
      }
      saveFile(filePath, generatedOutput);
    });
  } catch (e) {
    console.error(chalk.red('Error while generating routes definitions model'), '\n' + e);
  }
};

module.exports = assetsPathsModule;
module.exports.meta = require('../package.json');
