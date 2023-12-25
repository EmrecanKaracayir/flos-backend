import { IRefereeModel } from "../models/IRefereeModel";

export interface IRefereesProvider {
  getReferees: () => Promise<IRefereeModel[]>;

  getReferee: (refereeId: number) => Promise<IRefereeModel | null>;
}

export enum RefereesQueries {
  GET_REFEREES = `SELECT * FROM "RefereeView"`,
  GET_REFEREE_$RFID = `SELECT * FROM "RefereeView" WHERE "refereeId" = $1`,
}
