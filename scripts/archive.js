const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const zipFile = path.join(__dirname, '../app.zip');
const stream = fs.createWriteStream(zipFile);
const archive = archiver('zip');

archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
        // log warning
    } else {
        // throw error
        throw err;
    }
});
archive.on('error', function(err) {
    throw err;
});
archive.pipe(stream)
archive.directory(path.join(__dirname, '../build'),false);
archive.finalize();
console.log(`Archive created at ${path.join(__dirname, '../app.zip')}`);
