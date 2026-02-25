const { execSync } = require("child_process");

function getAvailablePort() {
  const output = execSync('docker ps --format "{{.Ports}}"')
    .toString()
    .split("\n");

  const usedPorts = output
    .map(line => {
      const match = line.match(/0\.0\.0\.0:(\d+)/);
      return match ? parseInt(match[1]) : null;
    })
    .filter(Boolean);

  let port = 4001;

  while (usedPorts.includes(port)) {
    port++;
  }

  return port;
}

module.exports = getAvailablePort;