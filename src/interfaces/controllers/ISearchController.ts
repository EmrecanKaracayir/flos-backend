import { NextFunction, Request, Response } from "express";
import { ISearchService } from "../services/ISearchService";

export interface ISearchController {
  readonly searchService: ISearchService;

  getSearch_: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
