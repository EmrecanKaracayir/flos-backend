import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { IOrganizerModel } from "../interfaces/models/IOrganizerModel";
import { IParticipantModel } from "../interfaces/models/IParticipantModel";
import {
  ILoginProvider,
  LoginQueries,
} from "../interfaces/providers/ILoginProvider";
import { ModelMismatchError } from "../interfaces/schemas/responses/app/IServerError";
import { OrganizerModel } from "../models/OrganizerModel";
import { ParticipantModel } from "../models/ParticipantModel";

export class LoginProvider implements ILoginProvider {
  public async getOrganizer(username: string): Promise<IOrganizerModel | null> {
    const organizerRes: QueryResult = await pool.query(
      LoginQueries.GET_ORGANIZER_$UNAME,
      [username],
    );
    const organizerRec: unknown = organizerRes.rows[0];
    if (!organizerRec) {
      return null;
    }
    if (!OrganizerModel.isValidModel(organizerRec)) {
      throw new ModelMismatchError(organizerRec);
    }
    return organizerRec as IOrganizerModel;
  }

  public async getParticipant(
    username: string,
  ): Promise<IParticipantModel | null> {
    const participantRes: QueryResult = await pool.query(
      LoginQueries.GET_PARTICIPANT_$UNAME,
      [username],
    );
    const participantRec: unknown = participantRes.rows[0];
    if (!participantRec) {
      return null;
    }
    if (!ParticipantModel.isValidModel(participantRec)) {
      throw new ModelMismatchError(participantRec);
    }
    return participantRec as IParticipantModel;
  }
}
