import { Router } from "express";
import { MyLeaguesController } from "../controllers/MyLeaguesController";
import { IMyLeaguesController } from "../interfaces/controllers/IMyLeaguesController";
import { IRoute } from "../interfaces/routes/IRoute";

export class MyLeaguesRoute implements IRoute {
  public readonly router: Router;
  private readonly path: string;
  private readonly myLeaguesController: IMyLeaguesController;

  constructor() {
    this.router = Router();
    this.path = "/my/leagues";
    this.myLeaguesController = new MyLeaguesController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      this.path,
      this.myLeaguesController.getMyLeagues.bind(this.myLeaguesController),
    );
    this.router.post(
      this.path,
      this.myLeaguesController.postMyLeagues.bind(this.myLeaguesController),
    );
    this.router.get(
      `${this.path}/:leagueId`,
      this.myLeaguesController.getMyLeagues$leagueId.bind(
        this.myLeaguesController,
      ),
    );
  }
}
