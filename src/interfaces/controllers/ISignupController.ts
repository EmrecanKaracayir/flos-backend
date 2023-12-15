import { NextFunction, Request, Response } from "express";
import { ISignupService } from "../services/ISignupService";

export interface ISignupController {
  readonly signupService: ISignupService;

  signupOrganizer: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  signupParticipant: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
