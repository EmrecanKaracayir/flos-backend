import { NextFunction, Request, Response } from "express";
import { ISignupService } from "../services/ISignupService";

export interface ISignupController {
  readonly signupService: ISignupService;

  postSignupOrganizer: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  postSignupParticipant: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
