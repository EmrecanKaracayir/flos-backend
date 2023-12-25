import { Router } from "express";
import { RefereesController } from "../controllers/RefereesController";
import { IRefereesController } from "../interfaces/controllers/IRefereesController";
import { IRoute } from "../interfaces/routes/IRoute";

export class RefereesRoute implements IRoute {
  public readonly router: Router;
  public static readonly path: string = "referees";
  private readonly refereesController: IRefereesController;

  constructor() {
    this.router = Router();
    this.refereesController = new RefereesController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/",
      this.refereesController.getReferees.bind(this.refereesController),
    );
    this.router.get(
      "/:refereeId",
      this.refereesController.getReferees$.bind(this.refereesController),
    );
  }
}
