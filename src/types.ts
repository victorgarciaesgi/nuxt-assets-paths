export interface NuxtAssetsPathsOptions {
  //
  /**
   * Path to where you cant the file to be saved (ex: "./src/models/assets.ts")
   * @default "<srcDir>/__assetsPaths.ts"
   */
  filePath?: string;

  /** Name of the routesNames object (ex: "routesTree")
   * @default "assetsPaths"
   * */
  pathsObjectName?: string;

  /**
   * Enables static files paths generation
   * @default false */
  staticPaths?: boolean;
}
