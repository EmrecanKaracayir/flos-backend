import { Router } from "express";
import { ISignupController } from "../interfaces/controllers/ISignupController";
import { IRoute } from "../interfaces/routes/IRoute";
import { SignupController } from "../controllers/SignupController";

export class SignupRoute implements IRoute {
  public readonly router: Router;
  private readonly organizerPath: string;
  private readonly participantPath: string;
  private readonly signupController: ISignupController;

  constructor() {
    this.router = Router();
    this.organizerPath = "/signup/organizer";
    this.participantPath = "/signup/participant";
    this.signupController = new SignupController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      this.organizerPath,
      this.signupController.signupOrganizer.bind(this.signupController),
    );
    this.router.post(
      this.participantPath,
      this.signupController.signupParticipant.bind(this.signupController),
    );
  }
}
