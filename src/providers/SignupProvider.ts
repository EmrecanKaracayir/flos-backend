import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { IOrganizerModel } from "../interfaces/models/IOrganizerModel";
import { IParticipantModel } from "../interfaces/models/IParticipantModel";
import { IRecordExistsModel } from "../interfaces/models/common/IRecordExistsModel";
import {
  ISignupProvider,
  SignupQueries,
} from "../interfaces/providers/ISignupProvider";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
} from "../interfaces/schemas/responses/common/IServerError";
import { OrganizerModel } from "../models/OrganizerModel";
import { ParticipantModel } from "../models/ParticipantModel";
import { RecordExistsModel } from "../models/common/RecordExistsModel";

export class SignupProvider implements ISignupProvider {
  public async doesOrganizerByUsernameExist(
    username: string,
  ): Promise<IRecordExistsModel> {
    const reRes: QueryResult = await pool.query(
      SignupQueries.DOES_ORGANIZER_BY_$USERNAME_EXIST,
      [username],
    );
    const reRec: unknown = reRes.rows[0];
    if (!reRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExistsModel.isValidModel(reRec)) {
      throw new ModelMismatchError(reRec);
    }
    return reRec as IRecordExistsModel;
  }

  public async doesOrganizerByEmailExist(
    email: string,
  ): Promise<IRecordExistsModel> {
    const reRes: QueryResult = await pool.query(
      SignupQueries.DOES_ORGANIZER_BY_$EMAIL_EXIST,
      [email],
    );
    const reRec: unknown = reRes.rows[0];
    if (!reRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExistsModel.isValidModel(reRec)) {
      throw new ModelMismatchError(reRec);
    }
    return reRec as IRecordExistsModel;
  }

  public async createOrganizer(
    username: string,
    password: string,
    email: string,
  ): Promise<IOrganizerModel> {
    const organizerRes: QueryResult = await pool.query(
      SignupQueries.CREATE_ORGANIZER_WITH_$USERNAME_$PASSWORD_$EMAIL,
      [username, password, email],
    );
    const organizerRec: unknown = organizerRes.rows[0];
    if (!organizerRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!OrganizerModel.isValidModel(organizerRec)) {
      throw new ModelMismatchError(organizerRec);
    }
    return organizerRec as IOrganizerModel;
  }

  public async doesParticipantByUsernameExist(
    username: string,
  ): Promise<IRecordExistsModel> {
    const reRes: QueryResult = await pool.query(
      SignupQueries.DOES_PARTICIPANT_BY_$USERNAME_EXIST,
      [username],
    );
    const reRec: unknown = reRes.rows[0];
    if (!reRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExistsModel.isValidModel(reRec)) {
      throw new ModelMismatchError(reRec);
    }
    return reRec as IRecordExistsModel;
  }

  public async doesParticipantByEmailExist(
    email: string,
  ): Promise<IRecordExistsModel> {
    const reRes: QueryResult = await pool.query(
      SignupQueries.DOES_PARTICIPANT_BY_$EMAIL_EXIST,
      [email],
    );
    const reRec: unknown = reRes.rows[0];
    if (!reRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExistsModel.isValidModel(reRec)) {
      throw new ModelMismatchError(reRec);
    }
    return reRec as IRecordExistsModel;
  }

  public async createParticipant(
    username: string,
    password: string,
    email: string,
  ): Promise<IParticipantModel> {
    const participantRes: QueryResult = await pool.query(
      SignupQueries.CREATE_PARTICIPANT_WITH_$USERNAME_$PASSWORD_$EMAIL,
      [username, password, email],
    );
    const participantRec: unknown = participantRes.rows[0];
    if (!participantRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!ParticipantModel.isValidModel(participantRec)) {
      throw new ModelMismatchError(participantRec);
    }
    return participantRec as IParticipantModel;
  }
}
