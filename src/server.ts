import dotenv from "dotenv";
import express, { Express } from "express";
import { API_PREFIX } from "./core/utils/constants";
import { AuthMiddleware } from "./middlewares/AuthMiddleware";
import { CatcherMiddleware } from "./middlewares/CatcherMiddleware";
import { FailureMiddleware } from "./middlewares/FailureMiddleware";
import { LoggerMiddleware } from "./middlewares/LoggerMiddleware";
import { AvailableRoute } from "./routes/AvailableRoute";
import { ClubsRoute } from "./routes/ClubsRoute";
import { FixturesRoute } from "./routes/FixturesRoute";
import { LeaguesRoute } from "./routes/LeaguesRoute";
import { LoginRoute } from "./routes/LoginRoute";
import { MyClubRoute } from "./routes/MyClubRoute";
import { MyFixturesRoute } from "./routes/MyFixturesRoute";
import { MyLeaguesRoute } from "./routes/MyLeaguesRoute";
import { MyPlayerRoute } from "./routes/MyPlayerRoute";
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
app.use(`${API_PREFIX}/${AvailableRoute.path}`, new AvailableRoute().router);
app.use(`${API_PREFIX}/${ClubsRoute.path}`, new ClubsRoute().router);
app.use(`${API_PREFIX}/${FixturesRoute.path}`, new FixturesRoute().router);
app.use(`${API_PREFIX}/${LeaguesRoute.path}`, new LeaguesRoute().router);
app.use(`${API_PREFIX}/${LoginRoute.path}`, new LoginRoute().router);
app.use(`${API_PREFIX}/${PlayersRoute.path}`, new PlayersRoute().router);
app.use(`${API_PREFIX}/${RefereesRoute.path}`, new RefereesRoute().router);
app.use(`${API_PREFIX}/${SearchRoute.path}`, new SearchRoute().router);
app.use(`${API_PREFIX}/${SignupRoute.path}`, new SignupRoute().router);
app.use(`${API_PREFIX}/${VenuesRoute.path}`, new VenuesRoute().router);

// Routes with Authentication
app.use(
  `${API_PREFIX}/${MyClubRoute.path}`,
  AuthMiddleware.verifyAuth(["participant"]),
  new MyClubRoute().router,
);
app.use(
  `${API_PREFIX}/${MyFixturesRoute.path}`,
  AuthMiddleware.verifyAuth(["organizer"]),
  new MyFixturesRoute().router,
);
app.use(
  `${API_PREFIX}/${MyLeaguesRoute.path}`,
  AuthMiddleware.verifyAuth(["organizer"]),
  new MyLeaguesRoute().router,
);
app.use(
  `${API_PREFIX}/${MyPlayerRoute.path}`,
  AuthMiddleware.verifyAuth(["participant"]),
  new MyPlayerRoute().router,
);

// Post-Middlewares
app.use("*", CatcherMiddleware.resourceNotFound);
app.use(FailureMiddleware.serverFailure);

// Server
app.listen(port, (): void => {
  console.log(`Server listening on port ${port}`);
});
