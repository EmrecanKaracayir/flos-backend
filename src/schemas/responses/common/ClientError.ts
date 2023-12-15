import {
  ClientErrorCode,
  IClientError,
  clientErrorMessages,
} from "../../../interfaces/schemas/responses/common/IClientError";

export class ClientError implements IClientError {
  public readonly code: number;
  public readonly message: string;

  constructor(clientErrorCode: ClientErrorCode) {
    this.code = clientErrorCode;
    this.message = clientErrorMessages[clientErrorCode];
  }
}
