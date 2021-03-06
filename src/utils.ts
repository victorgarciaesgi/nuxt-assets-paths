import { resolve } from 'path';
import { promises } from 'fs';
import { camelCase } from 'lodash';

const fileRegxp = /(\w*)\.\w+$/;
const extensionRegxp = /^(.+)\.(\w+)(\?.+)?/;

const getFileName = (file: string) => {
  const match = extensionRegxp.exec(file);
  return match?.[1] ?? null;
};

const getFileExtension = (file: string) => {
  const match = extensionRegxp.exec(file);
  return match?.[2] ?? null;
};

export async function processAssetDir(
  dir: string,
  parent: string,
  outObject: string,
  interfaceType: string,
  extension?: string
) {
  const isTs = extension === 'ts';

  async function* getFiles(dir: string, parent: string): any {
    const dirents = await promises.readdir(dir, { withFileTypes: true });
    const filesInDirectory = dirents
      .filter((f) => f.isFile())
      .map((m) => {
        return {
          ext: getFileExtension(m.name),
          fileName: getFileName(m.name),
        };
      });
    for (const dirent of dirents) {
      const res = resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        outObject += `${dirent.name}: {`;
        const assetPath = `${parent}${dirent.name}/`;
        yield* getFiles(res, assetPath);
        outObject += '},';
      } else {
        if (fileRegxp.exec(dirent.name)) {
          const fileName = getFileName(dirent.name);
          const ext = getFileExtension(dirent.name);
          if (fileName && ext) {
            let formatedFileName = camelCase(fileName);
            if (filesInDirectory.filter((f) => f.fileName === fileName).length > 1) {
              formatedFileName = `${formatedFileName}_${ext}`;
            }
            const assetPath = `${parent}${dirent.name}`;
            outObject += `${formatedFileName}: "${assetPath}",`;
            if (isTs) interfaceType += `| "${assetPath}"`;
          }
        }
        yield res;
      }
    }
  }

  for await (const f of getFiles(dir, parent)) {
  }
  outObject += `} ${isTs ? 'as const' : ''}`;
  outObject += `\n\n ${interfaceType}`;

  return outObject;
}
