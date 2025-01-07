const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const dirOut = path.join(__dirname, "C_outputs");

// Create the outputs directory if it doesn't exist
if (!fs.existsSync(dirOut)) {
  fs.mkdirSync(dirOut, { recursive: true });
}

// Determine platform-specific settings
const isWindows = process.platform === "win32";
const executableExtension = isWindows ? ".exe" : ".out";

const runC = (filePath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outPath = path.join(dirOut, `${jobId}${executableExtension}`); // Use platform-specific extension

  return new Promise((resolve, reject) => {
    const command = isWindows
      ? `gcc "${filePath}" -o "${outPath}" && "${outPath}"`
      : `gcc "${filePath}" -o "${outPath}" && cd "${dirOut}" && ./${jobId}.out`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout);
    });
  });
};

module.exports = {
  runC,
};