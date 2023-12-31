import { Router } from "express";
import { MyPlayerController } from "../controllers/MyPlayerController";
import { IMyPlayerController } from "../interfaces/controllers/IMyPlayerController";
import { IRoute } from "../interfaces/routes/IRoute";

export class MyPlayerRoute implements IRoute {
  public readonly router: Router;
  public static readonly path: string = "my/player";
  private readonly myPlayerController: IMyPlayerController;

  constructor() {
    this.router = Router();
    this.myPlayerController = new MyPlayerController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/",
      this.myPlayerController.getMyPlayer.bind(this.myPlayerController),
    );
    this.router.post(
      "/",
      this.myPlayerController.postMyPlayer.bind(this.myPlayerController),
    );
    this.router.put(
      "/",
      this.myPlayerController.putMyPlayer.bind(this.myPlayerController),
    );
    this.router.delete(
      "/",
      this.myPlayerController.deleteMyPlayer.bind(this.myPlayerController),
    );
    this.router.delete(
      "/resign",
      this.myPlayerController.deleteMyPlayerResign.bind(
        this.myPlayerController,
      ),
    );
  }
}
