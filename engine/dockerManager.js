const { exec } = require("child_process");

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(stderr);
      resolve(stdout);
    });
  });
}

async function deployContainer(projectPath, port, name) {
  const buildCmd = `docker build -t ${name} ${projectPath}`;
  const runCmd = `docker run -d -p ${port}:3000 --name ${name} ${name}`;

  await runCommand(buildCmd);
  await runCommand(runCmd);

  return `App running on http://localhost:${port}`;
}

module.exports = deployContainer;