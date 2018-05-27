#!/usr/bin/env node
'use strict'

const { GetFileList } = require('./filelist');
const path = require('path');

// TODO: Add this function to the stat object and put in filelist.js

// checks each mode value to determine if file is executable
const canExecuteFile = (statObj) => {

  // 73 base 10 === 0111 
  const EXEC_MASK = 73;

  return statObj.mode & EXEC_MASK;
}

// commander seems to be the only command line arg package where -abc === -a -b -c. 
// yargs doesn't seem to offer that. 
const program = require('commander')
  .usage('[options] [file]')
  .option('-a, --all', 'List all')
  .option('-F, --decorator', 'displays file decorators: /, * or @')
  .parse(process.argv);

const fileList = GetFileList(program.args.length === 0 ? ['.'] : program.args);

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
