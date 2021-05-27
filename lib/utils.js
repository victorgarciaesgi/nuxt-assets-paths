"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAssetDir = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const fileRegxp = /(\w*)\.\w+$/;
const extensionRegxp = /^(.+)\.(\w+)(\?.+)?/;
const getFileName = (file) => {
    var _a;
    const match = extensionRegxp.exec(file);
    return (_a = match === null || match === void 0 ? void 0 : match[1]) !== null && _a !== void 0 ? _a : null;
};
const getFileExtension = (file) => {
    var _a;
    const match = extensionRegxp.exec(file);
    return (_a = match === null || match === void 0 ? void 0 : match[2]) !== null && _a !== void 0 ? _a : null;
};
async function processAssetDir(dir, parent, outObject, extension) {
    async function* getFiles(dir, parent) {
        const dirents = await fs_1.promises.readdir(dir, { withFileTypes: true });
        const filesInDirectory = dirents
            .filter((f) => f.isFile())
            .map((m) => {
            return {
                ext: getFileExtension(m.name),
                fileName: getFileName(m.name),
            };
        });
        for (const dirent of dirents) {
            const res = path_1.resolve(dir, dirent.name);
            if (dirent.isDirectory()) {
                outObject += `${dirent.name}: {`;
                yield* getFiles(res, `${parent}${dirent.name}/`);
                outObject += '},';
            }
            else {
                if (fileRegxp.exec(dirent.name)) {
                    const fileName = getFileName(dirent.name);
                    const ext = getFileExtension(dirent.name);
                    if (fileName && ext) {
                        let formatedFileName = lodash_1.camelCase(fileName);
                        if (filesInDirectory.filter((f) => f.fileName === fileName).length > 1) {
                            formatedFileName = `${formatedFileName}_${ext}`;
                        }
                        outObject += `${formatedFileName}: "${parent}${dirent.name}",`;
                    }
                }
                yield res;
            }
        }
    }
    for await (const f of getFiles(dir, '~assets/')) {
    }
    outObject += `} ${extension === 'ts' ? 'as const' : ''}`;
    return outObject;
}
exports.processAssetDir = processAssetDir;
