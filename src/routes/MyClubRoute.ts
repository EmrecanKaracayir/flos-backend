import { Router } from "express";
import { MyClubController } from "../controllers/MyClubController";
import { IMyClubController } from "../interfaces/controllers/IMyClubController";
import { IRoute } from "../interfaces/routes/IRoute";

export class MyClubRoute implements IRoute {
  public readonly router: Router;
  private readonly path: string;
  private readonly myClubController: IMyClubController;

  constructor() {
    this.router = Router();
    this.path = "/";
    this.myClubController = new MyClubController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      this.path,
      this.myClubController.getMyClub.bind(this.myClubController),
    );
    this.router.post(
      this.path,
      this.myClubController.postMyClub.bind(this.myClubController),
    );
    this.router.put(
      this.path,
      this.myClubController.putMyClub.bind(this.myClubController),
    );
    this.router.delete(
      this.path,
      this.myClubController.deleteMyClub.bind(this.myClubController),
    );
  }
}
