import { NextFunction, Request, Response } from "express";

export class LoggerMiddleware {
  public static log(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Response | void {
    console.log(
      `Received a ${req.method} request on ${
        req.url
      } at ${new Date().toISOString()}`,
    );
    return next();
  }
}
