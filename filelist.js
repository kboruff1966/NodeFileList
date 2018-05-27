
const fs = require('fs');
const path = require('path');

const createFileData = (name, stat, filelist = []) => {
  return { name: name, stat: stat, filelist: filelist };
}

exports.GetFileList = (argList) => {

  let fileList = [];

  // fetch all the file data listed in arguments
  argList.forEach((fileArg) => {

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


  return fileList;


}

