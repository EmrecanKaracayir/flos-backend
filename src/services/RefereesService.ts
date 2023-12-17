import { IRefereeModel } from "../interfaces/models/IRefereeModel";
import { IRefereesProvider } from "../interfaces/providers/IRefereesProvider";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/common/IHttpStatus";
import { IRefereesResData } from "../interfaces/schemas/responses/routes/referees/IRefereesResData";
import { IRefereesService } from "../interfaces/services/IRefereesService";
import { RefereesProvider } from "../providers/RefereesProvider";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { RefereesResData } from "../schemas/responses/routes/referees/RefereesResData";

export class RefereesService implements IRefereesService {
  public readonly venuesProvider: IRefereesProvider;

  constructor() {
    this.venuesProvider = new RefereesProvider();
  }

  public async getReferees(
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IRefereesResData[]>> {
    const refereeModels: IRefereeModel[] =
      await this.venuesProvider.getRefereeModels();
    return new GenericResponse<IRefereesResData[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      RefereesResData.fromModels(refereeModels),
      null,
    );
  }

  public async getReferees$refereeId(
    refereeId: number,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IRefereesResData>> {
    const refereeModel: IRefereeModel | null =
      await this.venuesProvider.getRefereeModelById(refereeId);
    if (!refereeModel) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_REFEREE_FOUND_IN_REFEREES),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new GenericResponse<IRefereesResData>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      RefereesResData.fromModel(refereeModel),
      null,
    );
  }
}
