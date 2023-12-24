import { Router } from "express";
import { IRoute } from "../interfaces/routes/IRoute";
import { IAvailableController } from "../interfaces/controllers/IAvailableController";
import { AvailableController } from "../controllers/AvailableController";

export class AvailableRoute implements IRoute {
  public readonly router: Router;
  public static readonly path: string = "available";
  private readonly availableController: IAvailableController;

  constructor() {
    this.router = Router();
    this.availableController = new AvailableController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/clubs",
      this.availableController.getAvailableClubs.bind(this.availableController),
    );
    this.router.get(
      "/leagues",
      this.availableController.getAvailableLeagues.bind(
        this.availableController,
      ),
    );
    this.router.get(
      "/players",
      this.availableController.getAvailablePlayers.bind(
        this.availableController,
      ),
    );
  }
}
