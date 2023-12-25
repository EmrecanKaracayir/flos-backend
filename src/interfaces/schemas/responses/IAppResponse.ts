import { IClientError } from "./app/IClientError";
import { IHttpStatus } from "./app/IHttpStatus";
import { IServerError } from "./app/IServerError";

export interface IAppResponse<T> {
  readonly httpStatus: IHttpStatus;
  readonly serverError: IServerError | null;
  readonly clientErrors: Array<IClientError>;
  readonly data: T | null;
  readonly token: string | null;
}
