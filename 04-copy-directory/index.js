const fs = require('fs');
const path = require('path');

function copyDir(src, dest, callback) {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) return callback(err);

    fs.readdir(src, { withFileTypes: true }, (err, entries) => {
      if (err) return callback(err);

      if (!entries.length) return callback();

      for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          copyDir(srcPath, destPath, (err) => {
            if (err) return callback(err);
          });
        } else {
          fs.copyFile(srcPath, destPath, (err) => {
            if (err) return callback(err);
          });
        }
      }
    });
  });
}

copyDir(path.join(__dirname, "files"), path.join(__dirname, "files-copy"), (err) => {
  if (err) throw err;
});