#!/usr/bin/env node

const path = require("path");

const fs = require("fs");
const Promise = require("bluebird");
const fsp = Promise.promisifyAll(require("fs"));

const createFileData = (name, stat, filelist = []) => {
  return { name: name, stat: stat, filelist: filelist };
}

// TODO: Add this function to the stat object and put in filelist.js
// checks each mode value to determine if file is executable
const canExecuteFile = (statObj) => {

  // 73 base 10 === 0111 
  const EXEC_MASK = 73;
  return statObj.mode & EXEC_MASK;
}

// commander seems to be the only command line arg package where -abc === -a -b -c
// yargs doesn't seem to offer that. 
const program = require("commander")
  .usage("[options] [file]")
  .option("-a, --all', 'List all entries including . and ..")
  .option("-A, --All', 'List all entries except . and ..")
  .option("-F, --decorator', 'displays file decorators: /, * or @")
  .parse(process.argv);

// ============================================================================

let fileList = [];
let argList = program.args.length === 0 ? ["."] : program.args;

// fetch all the file data listed in arguments
argList.forEach((fileArg) => {

  fsp.statAsync(fileArg)
    .then(
      (stat) => {

        const fileArgData = createFileData(fileArg, stat);

        if (fileArgData.stat.isDirectory()) {

          // get the files in the directory
          const containedFileNames = fs.readdirSync(fileArgData.name);

          // add the . and .. directories since they're not returned from readdir()
          containedFileNames.unshift(".", "..");

          containedFileNames.forEach((fileName) => {
            const st = fs.statSync(path.join(fileArgData.name, fileName));
            fileArgData.filelist.push(createFileData(fileName, st));
          });
        }

        fileList.push(fileArgData);
      }
    )
    .catch(
      (err) => {
        console.log(err);
        fileList.push(createFileData(fileArg, null));
      }
    );

});

Promise.all(fileList)
  .then(
    () => {

      fileList.forEach((fileArgs) => {

        // error files
        if (fileArgs.stat === null) {
          console.log(fileArgs.name + ": No such file or directory");
        }

        else if (fileArgs.stat.isDirectory()) {

          console.log("\n" + fileArgs.name + ":");

          fileArgs.filelist.forEach((file) => {

            // append the / to subdirectory name
            if (program.decorator) {

              if (file.stat.isDirectory()) {
                file.name = path.join(file.name, "/");
              }

              else if (file.stat.isFile()) {
                if (program.decorator && canExecuteFile(file.stat)) {
                  file.name += "*";
                }

              }

            }

            // display all files
            if (program.all) {
              console.log(file.name);
            }

            else if (program.All) {
              if (file.name !== "." && file.name !== "..") {
                console.log(file.name);
              }
            }

            // do not display hidden file
            else if (file.name.search(/\..*$/) != 0) {
              console.log(file.name);
            }

          });
        }

        else if (fileArgs.stat.isFile()) {

          if (program.decorator && canExecuteFile(fileArgs.stat)) {
            fileArgs.name += "*";
          }

          console.log(fileArgs.name);

        }
      });

    }

  )
  .catch(
    (err) => {
      console.log("error " + err);
    }
  );


