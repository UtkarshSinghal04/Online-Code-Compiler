const { exec } = require('child_process');
const path = require('path');

const runPy = (filePath) => {
  return new Promise((resolve, reject) => {
    // Use quotes around the file path to handle spaces in the path
    const command = `python "${path.resolve(filePath)}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error: error.message, stderr });
        return;
      }
      if (stderr) {
        reject({ error: stderr });
        return;
      }
      resolve(stdout);
    });
  });
};

module.exports = {
  runPy
};