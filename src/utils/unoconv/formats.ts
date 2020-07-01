import { parseOptions } from "./parseOptions";
import { execFile, ExecException } from "child_process";
import debug from "debug";
import { default as mimedb } from "mime-db";

export interface IUnoconvFormats {
  format: string;
  doctype: string;
  extension: string;
  description: string;
}

export const formats = (options: any = {}) => {
  return new Promise<IUnoconvFormats[]>(function (resolve, reject) {
    options.show = true;
    const parsedOptions = parseOptions(options);
    const args = parsedOptions.args;

    debug(args.toString());

    const supportedFormats: IUnoconvFormats[] = [];
    execFile(parsedOptions.bin, args, function (
      err: ExecException | null,
      stdout: string,
      stderr: string
    ) {
      if (err) {
        return reject(err);
      }

      // For some reason --show outputs to stderr instead of stdout
      let lines = stderr.split("\n");
      let docType: string = "";
      lines.forEach(function (line) {
        if (
          line ===
          "The following list of document formats are currently available:"
        ) {
          docType = "document";
        } else if (
          line ===
          "The following list of graphics formats are currently available:"
        ) {
          docType = "graphics";
        } else if (
          line ===
          "The following list of presentation formats are currently available:"
        ) {
          docType = "presentation";
        } else if (
          line ===
          "The following list of spreadsheet formats are currently available:"
        ) {
          docType = "spreadsheet";
        } else {
          let format: RegExpMatchArray | string | null = line.match(/^(.*)-/);

          if (format) {
            format = format[1].trim();
          }

          let extension: RegExpMatchArray | string | null = line.match(
            /\[(.*)\]/
          );

          if (extension) {
            extension = extension[1].trim().replace(".", "");
          }

          let description: RegExpMatchArray | string | null = line.match(
            /-(.*)\[/
          );

          if (description) {
            description = description[1].trim();
          }

          if (format && extension && description) {
            supportedFormats.push({
              format: format,
              doctype: docType,
              extension: extension,
              description: description,
            });
          }
        }
      });
      resolve(supportedFormats);
    });
  });
};
