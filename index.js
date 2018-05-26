#!/usr/bin/env node
'use strict'

const fs = require('fs');

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

let fileArgStats = {};

// stats for the command file arguments
for (const fileArg of program.args) {

  try {
    fileArgStats[fileArg] = fs.statSync(fileArg);
  }

  catch (err) {
    // replace kpbLS with name of program
    console.log('kpbLS: ' + fileArg + ': no such file or directory');
  }
}


Object.keys(fileArgStats).forEach((key) => {

  if (fileArgStats[key].isDirectory()) {
    console.log(key + ' is directory... get its files');
  }

  else if (fileArgStats[key].isFile()) {
    console.log(key + ' is a file...nothing else needs to be done');

  }


});




// print
// for (const key in fileArgStats) {






//   // eslint: guard-for-in activated in .eslintrc.json
//   if (Object.prototype.hasOwnProperty(fileArgStats, key)) {

//     const element = fileArgStats[key];
//     // console.log(element);

//   }

//   else {
//     console.log('key is not in file arg list');
//   }
// }

// // print the processed file list according to options provided
// const printFiles = (fileList) => {

//   for (const fileArg of fileList) {

//     if (fileArg.isDir) {

//       console.log(fileArg.name + ':');


//     }

//     else if (fileArg.isFile) {
//       console.log(fileArg.name);

//     }

//     else {
//       console.log(fileArg.name + ': no such file or directory');
//     }

//   }
// }

// let fileList = [];

// // process file arguments
// let iterator = (index, callback) => {

//   if (index == program.args.length) {
//     callback(fileList);
//     return;
//   }

//   const path = program.args[index];

//   fs.stat(path, (err, stats) => {

//     if (err) {
//       fileList.push(createFileDataObj(path, false, false));
//     }

//     else if (stats.isDirectory()) {

//       const fileData = createFileDataObj(path, true, false);

//       // fileData.files = fs.readdirSync(path);

//       // fileData.files.push('.');
//       // fileData.files.push('..');
//       // fileData.files.sort();

//       fileList.push(fileData);

//     }

//     else if (stats.isFile()) {
//       fileList.push(createFileDataObj(path, false, true));
//     }

//     iterator(index + 1, callback);

//   });

// }

// iterator(0, printFiles);
