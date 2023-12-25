import { IAppResponse } from "../../interfaces/schemas/responses/IAppResponse";
import { IClientError } from "../../interfaces/schemas/responses/app/IClientError";
import { IHttpStatus } from "../../interfaces/schemas/responses/app/IHttpStatus";
import { IServerError } from "../../interfaces/schemas/responses/app/IServerError";

export class AppResponse<T> implements IAppResponse<T> {
  constructor(
    public readonly httpStatus: IHttpStatus,
    public readonly serverError: IServerError | null,
    public readonly clientErrors: IClientError[],
    public readonly data: T | null,
    public readonly token: string | null,
  ) {}
}
