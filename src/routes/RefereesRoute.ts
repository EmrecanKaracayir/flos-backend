import { Router } from "express";
import { RefereesController } from "../controllers/RefereesController";
import { IRefereesController } from "../interfaces/controllers/IRefereesController";
import { IRoute } from "../interfaces/routes/IRoute";

export class RefereesRoute implements IRoute {
  public readonly router: Router;
  private readonly path: string;
  private readonly refereesController: IRefereesController;

  constructor() {
    this.router = Router();
    this.path = "/";
    this.refereesController = new RefereesController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      this.path,
      this.refereesController.getReferees.bind(this.refereesController),
    );
    this.router.get(
      `${this.path}:refereeId`,
      this.refereesController.getReferees$refereeId.bind(
        this.refereesController,
      ),
    );
  }
}
