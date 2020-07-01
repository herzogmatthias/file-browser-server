import spawn from "cross-spawn";

export const listener = (port?: number) => {
  var args,
    bin = "unoconv";

  args = ["--listener"];
  if (port) {
    args.push("-p" + port);
  }

  return spawn(bin, args);
};
