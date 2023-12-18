import { Router } from "express";
import { LeaguesController } from "../controllers/LeaguesController";
import { ILeaguesController } from "../interfaces/controllers/ILeaguesController";
import { IRoute } from "../interfaces/routes/IRoute";

export class LeaguesRoute implements IRoute {
  public readonly router: Router;
  private readonly path: string;
  private readonly leaguesController: ILeaguesController;

  constructor() {
    this.router = Router();
    this.path = "/leagues";
    this.leaguesController = new LeaguesController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      this.path,
      this.leaguesController.getLeagues.bind(this.leaguesController),
    );
    this.router.get(
      `${this.path}/:leagueId`,
      this.leaguesController.getLeagues$leagueId.bind(this.leaguesController),
    );
  }
}
