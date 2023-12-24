import { Router } from "express";
import { LoginController } from "../controllers/LoginController";
import { ILoginController } from "../interfaces/controllers/ILoginController";
import { IRoute } from "../interfaces/routes/IRoute";

export class LoginRoute implements IRoute {
  public readonly router: Router;
  public static readonly path: string = "login";
  private readonly loginController: ILoginController;

  constructor() {
    this.router = Router();
    this.loginController = new LoginController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/organizer",
      this.loginController.postLoginOrganizer.bind(this.loginController),
    );
    this.router.post(
      "/participant",
      this.loginController.postLoginParticipant.bind(this.loginController),
    );
  }
}
