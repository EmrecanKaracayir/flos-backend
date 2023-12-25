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
      this.myLeaguesController.getMyLeagues$.bind(this.myLeaguesController),
    );
    this.router.put(
      "/:leagueId",
      this.myLeaguesController.putMyLeagues$.bind(this.myLeaguesController),
    );
    this.router.delete(
      "/:leagueId",
      this.myLeaguesController.deleteMyLeagues$.bind(this.myLeaguesController),
    );
    this.router.get(
      "/:leagueId/clubs",
      this.myLeaguesController.getMyLeagues$Clubs.bind(
        this.myLeaguesController,
      ),
    );
    this.router.post(
      "/:leagueId/clubs",
      this.myLeaguesController.postMyLeagues$Clubs.bind(
        this.myLeaguesController,
      ),
    );
  }
}
