const fs = require("fs");
const path = require("path");

let writeStream = fs.createWriteStream(
  path.join(__dirname, "project-dist", "bundle.css"),
  { encoding: "utf-8" }
);

fs.readdir(
  path.join(__dirname, "styles"),
  { withFileTypes: true },
  (err, data) => {
    if (err) return err;

    data.forEach((file) => {
      if (file.isFile() && path.extname(file.name).slice(1) == "css") {
        let readStream = fs.createReadStream(
          path.join(__dirname, "styles", file.name),
          { encoding: "utf-8" }
        );

        readStream.on("data", (data) => {
          writeStream.write(data);
        });
      }
    });
  }
);
