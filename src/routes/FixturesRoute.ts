import { Router } from "express";
import { FixturesController } from "../controllers/FixturesController";
import { IFixturesController } from "../interfaces/controllers/IFixturesController";
import { IRoute } from "../interfaces/routes/IRoute";

export class FixturesRoute implements IRoute {
  public readonly router: Router;
  public static readonly path: string = "fixtures";
  private readonly fixturesController: IFixturesController;

  constructor() {
    this.router = Router();
    this.fixturesController = new FixturesController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/",
      this.fixturesController.getFixtures.bind(this.fixturesController),
    );
    this.router.get(
      "/:fixtureId",
      this.fixturesController.getFixtures$.bind(this.fixturesController),
    );
  }
}
