export interface IOptions {
  level: number;
  onlyDir: boolean;
  showHiddenFiles: boolean;
  exclude?: RegExp[] | RegExp;
  extensions?: RegExp;
}
