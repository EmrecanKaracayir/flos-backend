import dotenv from "dotenv";
import express, { Express } from "express";
import { API_PREFIX } from "./core/utils/constants";
import { AuthMiddleware } from "./middlewares/AuthMiddleware";
import { CatcherMiddleware } from "./middlewares/CatcherMiddleware";
import { FailureMiddleware } from "./middlewares/FailureMiddleware";
import { LoggerMiddleware } from "./middlewares/LoggerMiddleware";
import { ClubsRoute } from "./routes/ClubsRoute";
import { LeaguesRoute } from "./routes/LeaguesRoute";
import { LoginRoute } from "./routes/LoginRoute";
import { MyLeaguesRoute } from "./routes/MyLeaguesRoute";
import { PlayersRoute } from "./routes/PlayersRoute";
import { RefereesRoute } from "./routes/RefereesRoute";
import { SearchRoute } from "./routes/SearchRoute";
import { SignupRoute } from "./routes/SignupRoute";
import { VenuesRoute } from "./routes/VenuesRoute";

// App
const app: Express = express();
const port: number = 3000;

// Environment Variables
dotenv.config();

// Pre-Middlewares
app.use(express.json());
app.use(LoggerMiddleware.log);

// Routes without Authentication
app.use(`${API_PREFIX}`, new LoginRoute().router);
app.use(`${API_PREFIX}`, new SignupRoute().router);
app.use(`${API_PREFIX}`, new RefereesRoute().router);
app.use(`${API_PREFIX}`, new VenuesRoute().router);
app.use(`${API_PREFIX}`, new LeaguesRoute().router);
app.use(`${API_PREFIX}`, new ClubsRoute().router);
app.use(`${API_PREFIX}`, new PlayersRoute().router);
app.use(`${API_PREFIX}`, new SearchRoute().router);
// Routes with Authentication
app.use(
  `${API_PREFIX}`,
  AuthMiddleware.verifyAuth(["organizer"]),
  new MyLeaguesRoute().router,
);

// Post-Middlewares
app.use("*", CatcherMiddleware.resourceNotFound);
app.use(FailureMiddleware.serverFailure);

// Server
app.listen(port, (): void => {
  console.log(`Server listening on port ${port}`);
});
