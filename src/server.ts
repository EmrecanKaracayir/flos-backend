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
import { MyPlayerRoute } from "./routes/MyPlayerRoute";
import { PlayersRoute } from "./routes/PlayersRoute";
import { RefereesRoute } from "./routes/RefereesRoute";
import { SearchRoute } from "./routes/SearchRoute";
import { SignupRoute } from "./routes/SignupRoute";
import { VenuesRoute } from "./routes/VenuesRoute";
import { MyClubRoute } from "./routes/MyClubRoute";

// App
const app: Express = express();
const port: number = 3000;

// Environment Variables
dotenv.config();

// Pre-Middlewares
app.use(express.json());
app.use(LoggerMiddleware.log);

// Routes without Authentication
app.use(`${API_PREFIX}/login`, new LoginRoute().router);
app.use(`${API_PREFIX}/signup`, new SignupRoute().router);
app.use(`${API_PREFIX}/referees`, new RefereesRoute().router);
app.use(`${API_PREFIX}/venues`, new VenuesRoute().router);
app.use(`${API_PREFIX}/leagues`, new LeaguesRoute().router);
app.use(`${API_PREFIX}/clubs`, new ClubsRoute().router);
app.use(`${API_PREFIX}/players`, new PlayersRoute().router);
app.use(`${API_PREFIX}/search`, new SearchRoute().router);

// Routes with Authentication
app.use(
  `${API_PREFIX}/my/leagues`,
  AuthMiddleware.verifyAuth(["organizer"]),
  new MyLeaguesRoute().router,
);
app.use(
  `${API_PREFIX}/my/player`,
  AuthMiddleware.verifyAuth(["participant"]),
  new MyPlayerRoute().router,
);
app.use(
  `${API_PREFIX}/my/club`,
  AuthMiddleware.verifyAuth(["participant"]),
  new MyClubRoute().router,
);

// Post-Middlewares
app.use("*", CatcherMiddleware.resourceNotFound);
app.use(FailureMiddleware.serverFailure);

// Server
app.listen(port, (): void => {
  console.log(`Server listening on port ${port}`);
});
