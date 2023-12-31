import {
  HttpStatusCode,
  IHttpStatus,
  httpStatusMessages,
} from "../../../interfaces/schemas/responses/app/IHttpStatus";

export class HttpStatus implements IHttpStatus {
  public readonly code: number;
  public readonly message: string;

  constructor(httpStatusCode: HttpStatusCode) {
    this.code = httpStatusCode;
    this.message = httpStatusMessages[httpStatusCode];
  }

  public isSuccess(): boolean {
    return this.code.toString().startsWith("2");
  }
}
