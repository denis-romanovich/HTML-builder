const fs = require("fs");
const path = require("path");

function copyAssets(src, dest, callback) {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) return callback(err);

    fs.readdir(src, { withFileTypes: true }, (err, entries) => {
      if (err) return callback(err);

      if (!entries.length) return callback();

      for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          copyAssets(srcPath, destPath, (err) => {
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

copyAssets(
  path.join(__dirname, "assets"),
  path.join(__dirname, "project-dist", "assets"),
  (err) => {
    if (err) throw err;
  }
);

function buildCss(callback) {
  let writeStream = fs.createWriteStream(
    path.join(__dirname, "project-dist", "style.css"),
    { encoding: "utf-8" }
  );

  fs.readdir(
    path.join(__dirname, "styles"),
    { withFileTypes: true },
    (err, data) => {
      if (err) return callback(err);

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
}

buildCss((err) => {
  if (err) console.error(err);
});

function buildHtml(callback) {
  const distDir = path.join(__dirname, `project-dist`);
  fs.mkdir(distDir, (err) => {
    if (err && err.code !== "EEXIST") return callback(err);

    fs.readFile(
      path.join(__dirname, "template.html"),
      "utf8",
      (err, template) => {
        if (err) return callback(err);

        const componentsDir = path.join(__dirname, "components");
        fs.readdir(componentsDir, (err, componentFiles) => {
          if (err) return callback(err);

          let newTemplate = template;
          let filesProcessed = 0;
          componentFiles.forEach((file) => {
            const componentName = path.basename(file, ".html");
            fs.readFile(
              path.join(componentsDir, file),
              "utf8",
              (err, componentContent) => {
                if (err) return callback(err);
                newTemplate = newTemplate.replace(
                  `{{${componentName}}}`,
                  componentContent
                );
                filesProcessed++;
                if (filesProcessed === componentFiles.length) {
                  fs.writeFile(
                    path.join(distDir, "index.html"),
                    newTemplate,
                    (err) => {
                      if (err) return callback(err);
                    }
                  );
                }
              }
            );
          });
        });
      }
    );
  });
}

buildHtml((err) => {
  if (err) console.error(err);
});
