import { IServerError } from "../../../interfaces/schemas/responses/app/IServerError";

export class ServerError implements IServerError {
  public readonly name: string;
  public readonly message: string;
  public readonly stackTrace: string | null;

  constructor(e: Error) {
    this.name = e.name;
    this.message = e.message;
    this.stackTrace = e.stack || null;
  }
}
