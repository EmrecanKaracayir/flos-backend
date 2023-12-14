import dotenv from "dotenv";
import express, { Express } from "express";
import { API_PREFIX } from "./core/utils/constants";
import { FailureMiddleware } from "./middlewares/FailureMiddleware";
import { LoggerMiddleware } from "./middlewares/LoggerMiddleware";
import { LoginRoute } from "./routes/LoginRoute";

// App
const app: Express = express();
const port: number = 3000;

// Environment Variables
dotenv.config();

// Pre-Middlewares
app.use(express.json());
app.use(LoggerMiddleware.log);

// Routes
app.use(`${API_PREFIX}`, new LoginRoute().router);

// Post-Middlewares
app.use(FailureMiddleware.failure);

// Server
app.listen(port, (): void => {
  console.log(`Server listening on port ${port}`);
});
