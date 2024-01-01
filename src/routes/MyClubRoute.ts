import { Router } from "express";
import { MyClubController } from "../controllers/MyClubController";
import { IMyClubController } from "../interfaces/controllers/IMyClubController";
import { IRoute } from "../interfaces/routes/IRoute";

export class MyClubRoute implements IRoute {
  public readonly router: Router;
  public static readonly path: string = "my/club";
  private readonly myClubController: IMyClubController;

  constructor() {
    this.router = Router();
    this.myClubController = new MyClubController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/",
      this.myClubController.getMyClub.bind(this.myClubController),
    );
    this.router.post(
      "/",
      this.myClubController.postMyClub.bind(this.myClubController),
    );
    this.router.put(
      "/",
      this.myClubController.putMyClub.bind(this.myClubController),
    );
    this.router.delete(
      "/",
      this.myClubController.deleteMyClub.bind(this.myClubController),
    );
    this.router.get(
      "/players",
      this.myClubController.getMyClubPlayers.bind(this.myClubController),
    );
    this.router.post(
      "/players",
      this.myClubController.postMyClubPlayers.bind(this.myClubController),
    );
    this.router.delete(
      "/players/:playerId",
      this.myClubController.deleteMyClubPlayers$.bind(this.myClubController),
    );
    this.router.delete(
      "/resign",
      this.myClubController.deleteMyClubResign.bind(this.myClubController),
    );
  }
}
