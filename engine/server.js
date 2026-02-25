const fs = require("fs");
const path = require("path");

const express = require("express");
const { exec } = require("child_process");
const detectProjectType = require("./projectDetector");
const getAvailablePort = require("./portManager");
const deployContainer = require("./dockerManager");
const createNginxConfig = require("./nginxManager");   
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/deploy", async (req, res) => {
  try {
    const { projectPath } = req.body;

    const type = detectProjectType(projectPath);
    const port = getAvailablePort();
    const name = `app-${uuidv4().slice(0, 8)}`;
    const projectName = path.basename(projectPath);
    const domain = `${projectName}.localhost`;

    console.log("Project Type:", type);

    const containerId = await deployContainer(projectPath, port, name);

    // ✅ Create nginx config automatically
    createNginxConfig(domain, port);

    // Read existing deployments
   
function saveDeployment(newDeployment) {
  const filePath = "./deployments.json";

  let deployments = [];

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf-8");
    deployments = JSON.parse(data);
  }

  deployments.push(newDeployment);

  fs.writeFileSync(
    filePath,
    JSON.stringify(deployments, null, 2)
  );
}
    res.json({
      status: "success",
      project: projectName,
      type,
      domain,
      port,
      containerId
    });

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.get("/deployments", (req, res) => {
  const deployments = JSON.parse(
    fs.readFileSync("./deployments.json")
  );
  res.json(deployments);
});

app.post("/stop", async (req, res) => {
  const { containerId } = req.body;
  exec(`docker stop ${containerId}`);
  res.json({ status: "stopped", containerId });
});

app.listen(5000, () => {
  console.log("Hosting Engine running on http://localhost:5000");
});