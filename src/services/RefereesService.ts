import { IRefereeModel } from "../interfaces/models/IRefereeModel";
import { IRefereesProvider } from "../interfaces/providers/IRefereesProvider";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/app/IHttpStatus";
import { IReferees$Res } from "../interfaces/schemas/responses/routes/referees/$refereeId/IReferees$Res";
import { IRefereesRes } from "../interfaces/schemas/responses/routes/referees/IRefereesRes";
import { IRefereesService } from "../interfaces/services/IRefereesService";
import { RefereesProvider } from "../providers/RefereesProvider";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { RefereesRes } from "../schemas/responses/routes/referees/RefereesRes";

export class RefereesService implements IRefereesService {
  public readonly refereesProvider: IRefereesProvider;

  constructor() {
    this.refereesProvider = new RefereesProvider();
  }

  public async getReferees(
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IRefereesRes[]>> {
    const models: IRefereeModel[] = await this.refereesProvider.getReferees();
    return new AppResponse<IRefereesRes[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      RefereesRes.fromModels(models),
      null,
    );
  }

  public async getReferees$(
    refereeId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IReferees$Res | null>> {
    const model: IRefereeModel | null =
      await this.refereesProvider.getReferee(refereeId);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_REFEREE_FOUND_IN_REFEREES),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new AppResponse<IReferees$Res>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      RefereesRes.fromModel(model),
      null,
    );
  }
}
