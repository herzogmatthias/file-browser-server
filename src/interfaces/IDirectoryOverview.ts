export interface IDirectoryOerview {
  name: string;
  path: string;
  relativePath: string;
  extension?: string;
  type: string;
  children?: IDirectoryOerview[];
}
