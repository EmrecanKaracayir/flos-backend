import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { IOrganizerModel } from "../interfaces/models/IOrganizerModel";
import { IParticipantModel } from "../interfaces/models/IParticipantModel";
import {
  ILoginProvider,
  LoginQueries,
} from "../interfaces/providers/ILoginProvider";
import { ModelMismatchError } from "../interfaces/schemas/responses/common/IServerError";
import { OrganizerModel } from "../models/OrganizerModel";
import { ParticipantModel } from "../models/ParticipantModel";

export class LoginProvider implements ILoginProvider {
  public async getOrganizerModelByUsername(
    username: string,
  ): Promise<IOrganizerModel | null> {
    const result: QueryResult = await pool.query(
      LoginQueries.GET_ORGANIZER_MODEL_BY_$USERNAME,
      [username],
    );
    const model: unknown = result.rows[0];
    if (!model) {
      return null;
    }
    if (!OrganizerModel.isValidModel(model)) {
      throw new ModelMismatchError(model);
    }
    return model as IOrganizerModel;
  }

  public async getParticipantModelByUsername(
    username: string,
  ): Promise<IParticipantModel | null> {
    const result: QueryResult = await pool.query(
      LoginQueries.GET_PARTICIPANT_MODEL_BY_$USERNAME,
      [username],
    );
    const model: unknown = result.rows[0];
    if (!model) {
      return null;
    }
    if (!ParticipantModel.isValidModel(model)) {
      throw new ModelMismatchError(model);
    }
    return model as ParticipantModel;
  }
}
