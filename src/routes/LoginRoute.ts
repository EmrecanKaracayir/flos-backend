import { Router } from "express";
import { LoginController } from "../controllers/LoginController";
import { ILoginController } from "../interfaces/controllers/ILoginController";
import { IRoute } from "../interfaces/routes/IRoute";

export class LoginRoute implements IRoute {
  public readonly router: Router;
  private readonly organizerPath: string;
  private readonly participantPath: string;
  private readonly loginController: ILoginController;

  constructor() {
    this.router = Router();
    this.organizerPath = "/login/organizer";
    this.participantPath = "/login/participant";
    this.loginController = new LoginController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      this.organizerPath,
      this.loginController.loginOrganizer.bind(this.loginController),
    );
    this.router.post(
      this.participantPath,
      this.loginController.loginParticipant.bind(this.loginController),
    );
  }
}
