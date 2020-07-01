import { debug } from "debug";
import spawn from "cross-spawn";
import { parseOptions } from "./parseOptions";
export const run = (options: any = {}) => {
  return new Promise<Buffer | string>(function (resolve, reject) {
    const parsedOptions = parseOptions(options);
    const args: any[] = parsedOptions.args;
    if (options.file) {
      args.push(options.file);
    }

    debug(args.toString());

    const child = spawn(parsedOptions.bin, args);
    const stdout: any[] = [];
    const stderr: any[] = [];

    child.on("error", (err) => {
      debug(err.message);
      if (err.message.indexOf("ENOENT") > -1) {
        console.error("Unoconv command not found");
      }
      return reject(err);
    });

    child.stdout!.on("data", function (data) {
      stdout.push(data);
    });

    child.stderr!.on("data", function (data) {
      stderr.push(data);
    });

    child.on("exit", function () {
      if (stderr.length) {
        return reject(new Error(Buffer.concat(stderr).toString("utf8")));
      }
      if (options.string) {
        resolve(Buffer.concat(stdout).toString("utf8"));
      } else if (options.output) {
        resolve(options.output);
      } else {
        resolve(Buffer.concat(stdout));
      }
    });
  });
};
