import { Router } from "express";
import { SignupController } from "../controllers/SignupController";
import { ISignupController } from "../interfaces/controllers/ISignupController";
import { IRoute } from "../interfaces/routes/IRoute";

export class SignupRoute implements IRoute {
  public readonly router: Router;
  public static readonly path: string = "signup";
  private readonly signupController: ISignupController;

  constructor() {
    this.router = Router();
    this.signupController = new SignupController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/organizer",
      this.signupController.postSignupOrganizer.bind(this.signupController),
    );
    this.router.post(
      "/participant",
      this.signupController.postSignupParticipant.bind(this.signupController),
    );
  }
}
