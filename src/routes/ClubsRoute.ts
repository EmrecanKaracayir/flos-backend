import { Router } from "express";
import { ClubsController } from "../controllers/ClubsController";
import { IClubsController } from "../interfaces/controllers/IClubsController";
import { IRoute } from "../interfaces/routes/IRoute";

export class ClubsRoute implements IRoute {
  public readonly router: Router;
  public static readonly path: string = "clubs";
  private readonly clubsController: IClubsController;

  constructor() {
    this.router = Router();
    this.clubsController = new ClubsController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/",
      this.clubsController.getClubs.bind(this.clubsController),
    );
    this.router.get(
      "/:clubId",
      this.clubsController.getClubs$clubId.bind(this.clubsController),
    );
  }
}
