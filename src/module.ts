import { Module } from '@nuxt/types';
import chalk from 'chalk';
import path from 'path';
import { saveFile } from './save';
import { NuxtAssetsPathsOptions } from './types';
import { processAssetDir } from './utils';

const assetsPathsModule: Module<NuxtAssetsPathsOptions> = function (moduleOptions) {
  try {
    const {
      filePath = `${this.options.srcDir}/__assetsPaths.ts`,
      pathsObjectName = 'assetsPaths',
      staticPaths = false,
    }: NuxtAssetsPathsOptions = { ...this.options.assetsPaths, ...moduleOptions };

    const iconFolderPath = path.resolve(process.cwd(), `${this.options.srcDir}/assets/`);
    console.log(iconFolderPath);

    let outObject = `const ${pathsObjectName} = {`;

    const extension = filePath.split('.').pop();

    this.nuxt.hook('build:before', async () => {
      const generatedOutput = await processAssetDir(
        iconFolderPath,
        '~assets/',
        outObject,
        extension
      );
      console.log(generatedOutput);
      saveFile(filePath, generatedOutput);
    });
  } catch (e) {
    console.error(chalk.red('Error while generating routes definitions model'), '\n' + e);
  }
};

module.exports = assetsPathsModule;
module.exports.meta = require('../package.json');
