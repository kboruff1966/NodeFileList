#!/usr/bin/env node
'use strict'

const fs = require('fs');
const path = require('path');

// 0111 -- checks each mode value to determine if file is executable
const EXEC_MASK = 73;

const canExecuteFile = (statObj) => {

  return statObj.mode & EXEC_MASK;
}

const createFileData = (name, stat, filelist = []) => {
  return { name: name, stat: stat, filelist: filelist };
}

const program = require('commander')
  .usage('[options] [file]')
  .option('-a, --all', 'List all')
  .option('-l, --long', 'Long list format')
  .option('-F, --decorator', 'displays file decorators: /, * or @')
  .parse(process.argv);

// hack to add file argument if empty
// TODO: I'd like to be able to just incorporate this into the command line processing above
if (program.args.length == 0) {
  program.args.push('.');
}

let fileList = [];

// fetch all the file data listed in arguments
program.args.forEach((fileArg) => {

  try {

    const fileArgData = createFileData(fileArg, fs.statSync(fileArg));

    // fetch sub files
    if (fileArgData.stat.isDirectory()) {

      // get the files in the directory
      const containedFileNames = fs.readdirSync(fileArgData.name);

      // add the . and .. directories since they're not returned from readdir()
      containedFileNames.unshift('.', '..');

      containedFileNames.forEach((fileName) => {
        const st = fs.statSync(path.join(fileArgData.name, fileName));
        fileArgData.filelist.push(createFileData(fileName, st));
      });

      fileList.push(fileArgData);
    }

    else if (fileArgData.stat.isFile()) {
      fileList.push(fileArgData);
    }

    // TODO: Symbolic link, named pipes.. etc

  }
  catch (err) {
    // replace kpbLS with name of program
    console.log('LS: ' + fileArg + ': no such file or directory');
  }
});

// print files
fileList.forEach((fileArgs) => {

  if (fileArgs.stat.isDirectory()) {

    console.log('\n' + fileArgs.name + ':');

    fileArgs.filelist.forEach((file) => {

      // append the / to subdirectory name
      if (program.decorator) {

        if (file.stat.isDirectory()) {
          file.name = path.join(file.name, '/');
        }

        else if (file.stat.isFile()) {
          if (program.decorator && canExecuteFile(file.stat)) {
            file.name += '*';
          }

        }

      }

      // display all files
      if (program.all) {
        console.log(file.name);
      }

      // do not display hidden file
      else if (file.name.search(/\..*$/) != 0) {
        console.log(file.name);
      }

    });
  }

  else if (fileArgs.stat.isFile()) {

    if (program.decorator && canExecuteFile(fileArgs.stat)) {
      fileArgs.name += '*';
    }

    console.log(fileArgs.name);

  }
});
