const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

function createNginxConfig(domain, port) {
  const config = `
server {
    listen 80;
    server_name ${domain};

    location / {
        proxy_pass http://host.docker.internal:${port};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
`;

  const filePath = path.join(
    __dirname,
    "nginx",
    `${domain}.conf`
  );

  fs.writeFileSync(filePath, config);

  exec("docker exec reverse-proxy nginx -s reload", (err) => {
    if (err) {
      console.error("Failed to reload nginx:", err);
    } else {
      console.log("Nginx reloaded successfully");
    }
  });
}

module.exports = createNginxConfig;