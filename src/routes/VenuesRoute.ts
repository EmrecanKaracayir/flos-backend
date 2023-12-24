import { Router } from "express";
import { VenuesController } from "../controllers/VenuesController";
import { IVenuesController } from "../interfaces/controllers/IVenuesController";
import { IRoute } from "../interfaces/routes/IRoute";

export class VenuesRoute implements IRoute {
  public readonly router: Router;
  public static readonly path: string = "venues";
  private readonly venuesController: IVenuesController;

  constructor() {
    this.router = Router();
    this.venuesController = new VenuesController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/",
      this.venuesController.getVenues.bind(this.venuesController),
    );
    this.router.get(
      "/:venueId",
      this.venuesController.getVenues$venueId.bind(this.venuesController),
    );
  }
}
