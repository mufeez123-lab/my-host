const express = require("express");
const detectProjectType = require("./projectDetector");
const getAvailablePort = require("./portManager");
const deployContainer = require("./dockerManager");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

app.post("/deploy", async (req, res) => {
  try {
    const { projectPath } = req.body;

    const type = detectProjectType(projectPath);
    const port = getAvailablePort();
    const name = `app-${uuidv4().slice(0, 8)}`;

    console.log("Project Type:", type);

    const result = await deployContainer(projectPath, port, name);

    res.json({
      status: "success",
      type,
      port,
      message: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(5000, () => {
  console.log("Hosting Engine running on http://localhost:5000");
});