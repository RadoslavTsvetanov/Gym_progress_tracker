const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = 3000;

const microservices = JSON.parse(fs.readFileSync("microservices.json", "utf8"));

const validateToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (req.path.startsWith("/auth")) {
    return next();
  }

    if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token not provided" });
  }

    jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

app.use(validateToken);

for (const serviceName in microservices) {
  const serviceConfig = microservices[serviceName];
  const baseURL = serviceConfig.baseURL;
  const routes = serviceConfig.routes;

  for (const routeName in routes) {
    const routePath = routes[routeName];
    const fullRoutePath = `/${serviceName}${routePath}`;

        app.use(
      fullRoutePath,
      createProxyMiddleware({
        target: baseURL,
        changeOrigin: true,
        pathRewrite: {
          [`^${fullRoutePath}`]: "",         },
      })
    );
  }
}

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
