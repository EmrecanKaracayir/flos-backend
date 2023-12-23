import { Router } from "express";
import { ClubsController } from "../controllers/ClubsController";
import { IClubsController } from "../interfaces/controllers/IClubsController";
import { IRoute } from "../interfaces/routes/IRoute";

export class ClubsRoute implements IRoute {
  public readonly router: Router;
  private readonly path: string;
  private readonly clubsController: IClubsController;

  constructor() {
    this.router = Router();
    this.path = "/";
    this.clubsController = new ClubsController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      this.path,
      this.clubsController.getClubs.bind(this.clubsController),
    );
    this.router.get(
      `${this.path}:clubId`,
      this.clubsController.getClubs$clubId.bind(this.clubsController),
    );
  }
}
