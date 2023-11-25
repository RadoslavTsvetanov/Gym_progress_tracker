const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const axios = require("axios");

const app = express();
const PORT = 3009;

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const microservices = JSON.parse(fs.readFileSync("microservices.json", "utf8"));

// const validateToken = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (req.path.startsWith("/auth")) {
//     return next();
//   }

//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized: Token not provided" });
//   }

//   jwt.verify(token, "your-secret-key", (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ error: "Unauthorized: Invalid token" });
//     }
//     req.user = decoded;
//     next();
//   });
// };

// app.use(validateToken);

for (const serviceName in microservices) {
  const serviceConfig = microservices[serviceName];
  const baseURL = serviceConfig.baseURL;
  const routes = serviceConfig.routes;

  for (const routeName in routes) {
    const routePath = routes[routeName];
    const fullRoutePath = `${routePath}`;
    console.log(fullRoutePath);
    console.log("------------");
    app.all(fullRoutePath, async (req, res) => {
      console.log("gate");
      console.log(req.body); // it does not recieve body
      console.log("gate");
      try {
        const requestData = {
          method: serviceConfig.methods[routeName],
          url: `${baseURL}${routes[routeName]}`,
          headers: {
            Authorization: req.headers.authorization,
          },
        };

        if (serviceConfig.methods[routeName] == "post") {
          requestData.data = req.body;
        } else if (serviceConfig.methods[routeName] == "get") {
          requestData.params = req.query;
        }

        const response = await axios(requestData);
        res.status(response.status).json(response.data);
      } catch (error) {
        if (error.response) {
          res.status(error.response.status).json(error.response.data);
        } else {
          console.error(error);
          res.status(500).json({ error: "Internal server error" });
        }
      }
    });
  }
}

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
