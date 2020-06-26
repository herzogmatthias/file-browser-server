export interface IDirectory {
  type: string;
  children?: IDirectory[];
  path: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  isSymbolicLink: boolean;
  realPath: string;
  extension?: string;
  name: string;
}
