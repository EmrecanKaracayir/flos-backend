import { Router } from "express";
import { MyLeaguesController } from "../controllers/MyLeaguesController";
import { IMyLeaguesController } from "../interfaces/controllers/IMyLeaguesController";
import { IRoute } from "../interfaces/routes/IRoute";

export class MyLeaguesRoute implements IRoute {
  public readonly router: Router;
  public static readonly path: string = "my/leagues";
  private readonly myLeaguesController: IMyLeaguesController;

  constructor() {
    this.router = Router();
    this.myLeaguesController = new MyLeaguesController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/",
      this.myLeaguesController.getMyLeagues.bind(this.myLeaguesController),
    );
    this.router.post(
      "/",
      this.myLeaguesController.postMyLeagues.bind(this.myLeaguesController),
    );
    this.router.get(
      "/:leagueId",
      this.myLeaguesController.getMyLeagues$leagueId.bind(
        this.myLeaguesController,
      ),
    );
    this.router.put(
      "/:leagueId",
      this.myLeaguesController.putMyLeagues$leagueId.bind(
        this.myLeaguesController,
      ),
    );
    this.router.delete(
      "/:leagueId",
      this.myLeaguesController.deleteMyLeagues$leagueId.bind(
        this.myLeaguesController,
      ),
    );
  }
}
