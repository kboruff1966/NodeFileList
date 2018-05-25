#!/usr/bin/env node
'use strict'

const fs = require('fs');

const createFileDataObj = (name, isDir, isFile, files) => {
  return { name: name, isDir: isDir, isFile: isFile, files: files };
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
  program.args.push('./');
}

let fileList = [];

// print the processed file list according to options provided
const callback = () => {

  if (program.all) console.log('list all files in directory: -a');
  if (program.long) console.log('long list format of files: -l');
  if (program.decorator) console.log('adorn file decorators on files: -F');





  for (const fileArg of fileList) {

    console.log();

    if (fileArg.isDir) {

      console.log(fileArg.name + ':');

      // list directory contents
      for (const f of fileArg.files) {

        // bypass hidden files if -a not set
        if (!program.all && f.search(/\..*$/) === 0) {
          continue;
        }


        console.log(f);
      }
    }

    else if (fileArg.isFile) {
      console.log(fileArg.name);

    }

    else {
      console.log(fileArg.name + ': no such file or directory');
    }

  }
}

// process file arguments
let iterator = (index) => {

  if (index == program.args.length) {
    callback();
    return;
  }

  fs.stat(program.args[index], (err, stats) => {

    const path = program.args[index];

    if (err) {
      fileList.push(createFileDataObj(path, false, false, null));
    }

    else if (stats.isDirectory()) {

      const fileData = createFileDataObj(path, true, false, null);
      fileData.files = fs.readdirSync(path);

      fileData.files.push('.');
      fileData.files.push('..');
      fileData.files.sort();

      fileList.push(fileData);

    }

    else if (stats.isFile()) {
      fileList.push(createFileDataObj(path, false, true, null));
    }

    iterator(index + 1);

  });

}

iterator(0);
