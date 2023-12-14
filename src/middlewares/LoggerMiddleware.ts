import { NextFunction, Request, Response } from "express";

export class LoggerMiddleware {
  public static log(
    req: Request,
    _: Response,
    next: NextFunction,
  ): Response | void {
    const time: Date = new Date();
    console.log(
      `Received a ${req.method} request on ${req.url} at ${time.toISOString()}`,
    );
    return next();
  }
}
