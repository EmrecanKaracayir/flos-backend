import { IRefereeModel } from "../models/IRefereeModel";

export interface IRefereesProvider {
  getRefereeModels: () => Promise<IRefereeModel[]>;

  getRefereeModelById: (refereeId: number) => Promise<IRefereeModel | null>;
}

export enum RefereesQueries {
  GET_REFEREE_MODELS = `SELECT * FROM "RefereeView"`,
  GET_REFEREE_MODEL_BY_$ID = `${GET_REFEREE_MODELS} WHERE "refereeId" = $1`,
}
