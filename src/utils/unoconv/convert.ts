import { run } from "./run";

export const convert = (file: string, options: any = {}) => {
  options.file = file;
  options.stdout = true;
  return run(options);
};
