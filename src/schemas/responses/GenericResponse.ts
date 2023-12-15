import { IGenericResponse } from "../../interfaces/schemas/responses/IGenericResponse";
import { IClientError } from "../../interfaces/schemas/responses/common/IClientError";
import { IHttpStatus } from "../../interfaces/schemas/responses/common/IHttpStatus";
import { IServerError } from "../../interfaces/schemas/responses/common/IServerError";

export class GenericResponse<T> implements IGenericResponse<T> {
  constructor(
    public readonly httpStatus: IHttpStatus,
    public readonly serverError: IServerError | null,
    public readonly clientErrors: IClientError[],
    public readonly data: T | null,
    public readonly token: string | null,
  ) {}
}
