#!/usr/bin/env node
'use strict'

const fs = require('fs');

const program = require('commander')
  .usage('[options] [file]')
  .option('-a, --all', 'List all')
  .option('-l, --long', 'Long list format')
  .option('-F, --decorator', 'displays file decorators: /, * or @')
  .parse(process.argv);

if (program.all) console.log('list all files in directory: -a');
if (program.long) console.log('long list format of files: -l');
if (program.decorator) console.log('adorn file decorators on files: -F');


let fileList = [];

// processes file list to print
const callback = () => {
  console.log("callback called");

  console.log(fileList);

}


let iterator = (index) => {

  if (index == program.args.length) {

    console.log('ALL DONE LOOPING');

    // tell caller that data is processed
    callback();
    return;
  }

  fs.stat(program.args[index], (err, stats) => {

    const path = program.args[index];
    console.log('PROCESS ' + path + ' AT INDEX: ' + index);


    // error file.
    if (err) {
      fileList.push({ name: path, isDir: false, isFile: false, subFiles: null });
      // console.log('error with ' + path);

    }

    else if (stats.isDirectory()) {
      // console.log(path + ' IS A DIRECTORY');
      fileList.push({ name: path, isDir: true, isFile: false, subFiles: null });

    }

    else if (stats.isFile()) {
      // console.log(path + ' IS A FILE');
      fileList.push({ name: path, isDir: false, isFile: true, subFiles: null });

    }

    iterator(index + 1)

  });

}

iterator(0);
