import { IPreviewOptions } from "../interfaces/IPreviewOptions";
import { unlink, lstat, existsSync } from "fs-extra";
import { extname, basename, join } from "path";
import { execFile } from "child_process";
import { default as mimedb } from "mime-db";

export const generatePreviewAsync = (
  input_original: string,

  output: string,
  options: IPreviewOptions = {
    keepAspect: true,
    pdf: false,
    width: 200,
    height: 300,
    quality: "100%",
    background: "#fff",
    pdf_path: "",
  }
) => {
  return new Promise<{ thumbnail: string; pdf?: string }>(async (res, rej) => {
    let input = input_original;
    if (!existsSync(input))
      rej({
        message:
          "file does not exist please make sure you are using the right path",
      });

    // Check for supported output format
    let extOutput = extname(output).toLowerCase().replace(".", "");
    let extInput = extname(input).toLowerCase().replace(".", "");
    let fileNameOrignal = basename(input, "." + extInput);

    if (extOutput != "gif" && extOutput != "jpg" && extOutput != "png") {
      rej({ message: "extension not supported, use png, gif, jpg" });
    }

    let fileType = "other";

    root: for (let index in mimedb) {
      if (mimedb[index].extensions !== undefined) {
        for (
          let indexExt = 0;
          indexExt < mimedb[index].extensions!.length;
          indexExt++
        ) {
          if (
            mimedb[index].extensions &&
            mimedb[index].extensions![indexExt] == extInput
          ) {
            if (index.split("/")[0] == "image") {
              fileType = "image";
            } else if (index.split("/")[0] == "video") {
              fileType = "video";
            } else {
              fileType = "other";
            }
            break root;
          }
        }
      }
    }

    if (extInput == "pdf") {
      fileType = "image";
    }

    lstat(input, function (error, stats) {
      if (error) rej(error);
      if (!stats.isFile()) {
        rej({ message: "Not a valid file." });
      } else {
        if (fileType == "video") {
          let ffmpegArgs = [
            "-y",
            "-i",
            input,
            "-vf",
            "thumbnail",
            "-frames:v",
            "1",
            output,
          ];
          if (options.width > 0 && options.height > 0) {
            ffmpegArgs.splice(
              4,
              1,
              "thumbnail,scale=" + options.width + ":" + options.height
            );
          }
          execFile("ffmpeg", ffmpegArgs, function (error) {
            if (error) rej(error);
            res({ thumbnail: output });
          });
        }

        if (fileType == "image") {
          let convertArgs = [input + "[0]", output, "-normalize"];
          if (options.width > 0 && options.height > 0) {
            if (options.keepAspect) {
              convertArgs.splice(
                0,
                0,
                "-resize",
                options.width + "x" + options.height
              );
            } else {
              convertArgs.splice(
                0,
                0,
                "-resize",
                options.width + "x" + options.height + "!"
              );
            }
          } else if (options.height > 0) {
            convertArgs.splice(0, 0, "-resize", "x" + options.height);
          } else if (options.width > 0) {
            convertArgs.splice(0, 0, "-resize", options.width.toString());
          }
          if (options.quality) {
            convertArgs.splice(0, 0, "-quality", options.quality);
          }
          if (options.background) {
            convertArgs.splice(0, 0, "-background", options.background);
            convertArgs.splice(0, 0, "-flatten");
          }
          execFile("convert", convertArgs, function (error) {
            if (error) rej(error);
            res({ thumbnail: output });
          });
        }

        if (fileType == "other") {
          let tempPDF = join(options.pdf_path, fileNameOrignal + ".pdf");

          execFile(
            "unoconv",
            ["-e", "PageRange=1", "-o", tempPDF, input],
            function (error) {
              if (error) rej(error);
              let convertOtherArgs = [tempPDF + "[0]", output];
              if (options.width > 0 && options.height > 0) {
                if (options.keepAspect) {
                  convertOtherArgs.splice(
                    0,
                    0,
                    "-resize",
                    options.width + "x" + options.height
                  );
                } else {
                  convertOtherArgs.splice(
                    0,
                    0,
                    "-resize",
                    options.width + "x" + options.height + "!"
                  );
                }
              } else if (options.height > 0) {
                convertOtherArgs.splice(0, 0, "-resize", "x" + options.height);
              } else if (options.width > 0) {
                convertOtherArgs.splice(
                  0,
                  0,
                  "-resize",
                  options.width.toString()
                );
              }
              if (options.quality) {
                convertOtherArgs.splice(0, 0, "-quality", options.quality);
              }
              if (options.background) {
                convertOtherArgs.splice(
                  0,
                  0,
                  "-background",
                  options.background
                );
                convertOtherArgs.splice(0, 0, "-flatten");
              }
              execFile("convert", convertOtherArgs, function (error) {
                if (error) rej(error);
                if (!options.pdf || options.pdf == undefined) {
                  unlink(tempPDF, function (error) {
                    if (error) rej(error);
                    res({ thumbnail: output });
                  });
                } else {
                  res({ thumbnail: output, pdf: tempPDF });
                }
              });
            }
          );
        }
      }
    });
  });
};
