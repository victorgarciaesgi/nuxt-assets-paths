"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const save_1 = require("./save");
const utils_1 = require("./utils");
const assetsPathsModule = function (moduleOptions) {
    try {
        const { filePath = `${this.options.srcDir}/__assetsPaths.ts`, pathsObjectName = 'assetsPaths', staticPaths = false, } = { ...this.options.assetsPaths, ...moduleOptions };
        const iconFolderPath = path_1.default.resolve(process.cwd(), `${this.options.srcDir}/assets/`);
        console.log(iconFolderPath);
        let outObject = `const ${pathsObjectName} = {`;
        const extension = filePath.split('.').pop();
        this.nuxt.hook('build:before', async () => {
            const generatedOutput = await utils_1.processAssetDir(iconFolderPath, '~assets/', outObject, extension);
            console.log(generatedOutput);
            save_1.saveFile(filePath, generatedOutput);
        });
    }
    catch (e) {
        console.error(chalk_1.default.red('Error while generating routes definitions model'), '\n' + e);
    }
};
module.exports = assetsPathsModule;
module.exports.meta = require('../package.json');
