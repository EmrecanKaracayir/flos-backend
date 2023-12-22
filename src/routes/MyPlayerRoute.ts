import { Router } from "express";
import { MyPlayerController } from "../controllers/MyPlayerController";
import { IMyPlayerController } from "../interfaces/controllers/IMyPlayerController";
import { IRoute } from "../interfaces/routes/IRoute";

export class MyPlayerRoute implements IRoute {
  public readonly router: Router;
  private readonly path: string;
  private readonly myPlayerController: IMyPlayerController;

  constructor() {
    this.router = Router();
    this.path = "/";
    this.myPlayerController = new MyPlayerController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      this.path,
      this.myPlayerController.getMyPlayer.bind(this.myPlayerController),
    );
    this.router.post(
      this.path,
      this.myPlayerController.postMyPlayer.bind(this.myPlayerController),
    );
  }
}
