import { IRefereeModel } from "../models/IRefereeModel";

export interface IRefereesProvider {
  getRefereeModels: () => Promise<IRefereeModel[]>;

  getRefereeModelById: (refereeId: number) => Promise<IRefereeModel | null>;
}

export enum RefereesQueries {
  GET_REFEREE_MODELS = `SELECT * FROM "Referee"`,
  GET_REFEREE_MODEL_BY_$ID = `SELECT * FROM "Referee" WHERE "refereeId" = $1`,
}