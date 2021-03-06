import * as express from "express";
import { readdirSync } from "fs";
import * as swagger from "swagger-ui-express";
import * as swaggerDocument from "../swagger.json";
import check from "./check-pings";
const app = express.default();
const router = express.default.Router();
app.use("/api-docs", swagger.serve, swagger.setup(swaggerDocument));
app.listen(process.env.PORT ? process.env.port : "1331", () =>
  console.log("Listening!")
);

readdirSync(`${__dirname}/routes`).map(async (route) => {
  console.log(`Registering ${route}`);
  router.get(
    (await import(`./routes/${route}`)).default.route,
    (await import(`./routes/${route}`)).default.function
  );
});
app.use("/", router);

setInterval(check, 60 * 1000);
