const fs = require("fs");

function detectProjectType(projectPath) {
  const packageJsonPath = `${projectPath}/package.json`;

  if (!fs.existsSync(packageJsonPath)) {
    throw new Error("package.json not found");
  }

  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf-8")
  );

  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  if (deps.next) return "nextjs";
  if (deps.express) return "node";
  if (deps["react-scripts"]) return "react";

  return "unknown";
}

module.exports = detectProjectType;