import { IRefereesProvider } from "../providers/IRefereesProvider";
import { IAppResponse } from "../schemas/responses/IAppResponse";
import { IClientError } from "../schemas/responses/app/IClientError";
import { IReferees$Res } from "../schemas/responses/routes/referees/$refereeId/IReferees$Res";
import { IRefereesRes } from "../schemas/responses/routes/referees/IRefereesRes";

export interface IRefereesService {
  readonly refereesProvider: IRefereesProvider;

  getReferees: (
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IRefereesRes[]>>;

  getReferees$: (
    refereeId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IReferees$Res | null>>;
}
