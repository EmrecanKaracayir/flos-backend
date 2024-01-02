import { Router } from "express";
import { MyFixturesController } from "../controllers/MyFixturesController";
import { IMyFixturesController } from "../interfaces/controllers/IMyFixturesController";
import { IRoute } from "../interfaces/routes/IRoute";

export class MyFixturesRoute implements IRoute {
  public readonly router: Router;
  public static readonly path: string = "my/fixtures";
  private readonly myFixturesController: IMyFixturesController;

  constructor() {
    this.router = Router();
    this.myFixturesController = new MyFixturesController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/",
      this.myFixturesController.getMyFixtures.bind(this.myFixturesController),
    );
    this.router.get(
      "/:fixtureId",
      this.myFixturesController.getMyFixtures$.bind(this.myFixturesController),
    );
    this.router.put(
      "/:fixtureId/simulate",
      this.myFixturesController.putMyFixtures$Simulate.bind(
        this.myFixturesController,
      ),
    );
  }
}
