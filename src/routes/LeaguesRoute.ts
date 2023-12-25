import { Router } from "express";
import { LeaguesController } from "../controllers/LeaguesController";
import { ILeaguesController } from "../interfaces/controllers/ILeaguesController";
import { IRoute } from "../interfaces/routes/IRoute";

export class LeaguesRoute implements IRoute {
  public readonly router: Router;
  public static readonly path: string = "leagues";
  private readonly leaguesController: ILeaguesController;

  constructor() {
    this.router = Router();
    this.leaguesController = new LeaguesController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/",
      this.leaguesController.getLeagues.bind(this.leaguesController),
    );
    this.router.get(
      "/:leagueId",
      this.leaguesController.getLeagues$.bind(this.leaguesController),
    );
  }
}
