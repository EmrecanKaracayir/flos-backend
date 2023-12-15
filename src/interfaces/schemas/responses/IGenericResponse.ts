import { IClientError } from "./common/IClientError";
import { IHttpStatus } from "./common/IHttpStatus";
import { IServerError } from "./common/IServerError";

export interface IGenericResponse<T> {
  readonly httpStatus: IHttpStatus;
  readonly serverError: IServerError | null;
  readonly clientErrors: Array<IClientError>;
  readonly data: T | null;
  readonly token: string | null;
}
