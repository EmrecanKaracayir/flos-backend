import { IRefereesProvider } from "../providers/IRefereesProvider";
import { IGenericResponse } from "../schemas/responses/IGenericResponse";
import { IClientError } from "../schemas/responses/common/IClientError";
import { IRefereesResData } from "../schemas/responses/routes/referees/IRefereesResData";

export interface IRefereesService {
  readonly refereesProvider: IRefereesProvider;

  getReferees: (
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IRefereesResData[]>>;

  getReferees$refereeId: (
    refereeId: number,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IRefereesResData | null>>;
}
