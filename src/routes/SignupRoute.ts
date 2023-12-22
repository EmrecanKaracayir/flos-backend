import { Router } from "express";
import { SignupController } from "../controllers/SignupController";
import { ISignupController } from "../interfaces/controllers/ISignupController";
import { IRoute } from "../interfaces/routes/IRoute";

export class SignupRoute implements IRoute {
  public readonly router: Router;
  private readonly organizerPath: string;
  private readonly participantPath: string;
  private readonly signupController: ISignupController;

  constructor() {
    this.router = Router();
    this.organizerPath = "/organizer";
    this.participantPath = "/participant";
    this.signupController = new SignupController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      this.organizerPath,
      this.signupController.postSignupOrganizer.bind(this.signupController),
    );
    this.router.post(
      this.participantPath,
      this.signupController.postSignupParticipant.bind(this.signupController),
    );
  }
}
