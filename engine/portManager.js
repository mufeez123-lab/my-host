let currentPort = 4000;

function getAvailablePort() {
  currentPort += 1;
  return currentPort;
}

module.exports = getAvailablePort;