import { NextFunction, Request, Response } from "express";
import { QUERY_MAX_LENGTH, QUERY_MIN_LENGTH } from "../core/rules/searchRules";
import { isStringInLengthBetween } from "../core/utils/strings";
import { ISearchController } from "../interfaces/controllers/ISearchController";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/common/IHttpStatus";
import { ISearchResData } from "../interfaces/schemas/responses/routes/search/ISearchResData";
import { ISearchService } from "../interfaces/services/ISearchService";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { SearchService } from "../services/SearchService";

export class SearchController implements ISearchController {
  public readonly searchService: ISearchService;

  constructor() {
    this.searchService = new SearchService();
  }

  public async getSearch_(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    let httpStatus: IHttpStatus;
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!req.query.q) {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(new ClientError(ClientErrorCode.MISSING_QUERY_$Q));
        return res
          .status(httpStatus.code)
          .send(
            new GenericResponse<null>(
              httpStatus,
              null,
              clientErrors,
              null,
              null,
            ),
          );
      }
      if (typeof req.query.q !== "string") {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(new ClientError(ClientErrorCode.INVALID_QUERY_$Q));
        return res
          .status(httpStatus.code)
          .send(
            new GenericResponse<null>(
              httpStatus,
              null,
              clientErrors,
              null,
              null,
            ),
          );
      }
      if (
        !isStringInLengthBetween(
          req.query.q,
          QUERY_MIN_LENGTH,
          QUERY_MAX_LENGTH,
        )
      ) {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(
          new ClientError(ClientErrorCode.INVALID_QUERY_LENGTH_$Q),
        );
        return res
          .status(httpStatus.code)
          .send(
            new GenericResponse<null>(
              httpStatus,
              null,
              clientErrors,
              null,
              null,
            ),
          );
      }
      // Hand over to service
      const serviceRes: IGenericResponse<ISearchResData> =
        await this.searchService.getSearch_(req.query.q, clientErrors);
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }
}
