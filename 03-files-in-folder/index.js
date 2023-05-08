const fs = require("fs");
const path = require("path");
const folderName = "secret-folder";

fs.readdir(
  path.join(__dirname, folderName), { withFileTypes: true }, (err, data) => {
    if (err) {
      console.log(err);
    }

    data.forEach(file => {
      if (file.isFile()) {
        fs.stat(
          path.join(__dirname, folderName, file.name),
          (err, stats) => {
            console.log(`${path.parse(file.name).name} - ${path.extname(file.name).slice(1)} - ${stats.size} B`);
          }
        );
      }
    });
  }
);
