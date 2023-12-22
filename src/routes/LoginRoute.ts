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
    this.organizerPath = "/organizer";
    this.participantPath = "/participant";
    this.loginController = new LoginController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      this.organizerPath,
      this.loginController.postLoginOrganizer.bind(this.loginController),
    );
    this.router.post(
      this.participantPath,
      this.loginController.postLoginParticipant.bind(this.loginController),
    );
  }
}
