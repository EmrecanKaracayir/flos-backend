import dotenv from "dotenv";
import express, { Express } from "express";
import { API_PREFIX } from "./core/utils/constants";
import { CatcherMiddleware } from "./middlewares/CatcherMiddleware";
import { FailureMiddleware } from "./middlewares/FailureMiddleware";
import { LoggerMiddleware } from "./middlewares/LoggerMiddleware";
import { LeaguesRoute } from "./routes/LeaguesRoute";
import { LoginRoute } from "./routes/LoginRoute";
import { RefereesRoute } from "./routes/RefereesRoute";
import { SignupRoute } from "./routes/SignupRoute";
import { VenuesRoute } from "./routes/VenuesRoute";
import { ClubsRoute } from "./routes/ClubsRoute";

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
app.use(`${API_PREFIX}`, new SignupRoute().router);
app.use(`${API_PREFIX}`, new RefereesRoute().router);
app.use(`${API_PREFIX}`, new VenuesRoute().router);
app.use(`${API_PREFIX}`, new LeaguesRoute().router);
app.use(`${API_PREFIX}`, new ClubsRoute().router);

// Post-Middlewares
app.use("*", CatcherMiddleware.resourceNotFound);
app.use(FailureMiddleware.serverFailure);

// Server
app.listen(port, (): void => {
  console.log(`Server listening on port ${port}`);
});
