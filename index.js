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


const fileList = program.args;
console.log(fileList);


fs.readdir('.', (err, files) => {

  if (err) {
    console.log('error retrieving files');
    return;
  }

  // prepare file list
  console.log(files);






});











