const fs = require('fs');
const path = require('path');
const { stdin } = process;

let writeStream = fs.createWriteStream(path.join(__dirname, "text.txt"),
    { encoding: 'utf-8' });

stdin.on('data', data => {
    if (data.toString().trim() === `exit`) {
        console.log(`Input ended`);
        process.exit();
    }
    console.log(`Write your text:`);
    writeStream.write(data,);
});

console.log(`Write your text:`);