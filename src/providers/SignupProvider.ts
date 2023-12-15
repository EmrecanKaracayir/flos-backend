import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { IOrganizerModel } from "../interfaces/models/IOrganizerModel";
import { IParticipantModel } from "../interfaces/models/IParticipantModel";
import { IRecordExistsModel } from "../interfaces/models/IRecordExistsModel";
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
import { RecordExists } from "../models/RecordExistsModel";

export class SignupProvider implements ISignupProvider {
  public async doesOrganizerByUsernameExist(
    username: string,
  ): Promise<IRecordExistsModel> {
    const result: QueryResult = await pool.query(
      SignupQueries.DOES_ORGANIZER_BY_$USERNAME_EXIST,
      [username],
    );
    const record: unknown = result.rows[0];
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExists.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return record;
  }

  public async doesOrganizerByEmailExist(
    email: string,
  ): Promise<IRecordExistsModel> {
    const result: QueryResult = await pool.query(
      SignupQueries.DOES_ORGANIZER_BY_$EMAIL_EXIST,
      [email],
    );
    const record: unknown = result.rows[0];
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExists.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return record;
  }

  public async createOrganizer(
    username: string,
    password: string,
    email: string,
  ): Promise<IOrganizerModel> {
    const result: QueryResult = await pool.query(
      SignupQueries.CREATE_ORGANIZER_WITH_$USERNAME_$PASSWORD_$EMAIL,
      [username, password, email],
    );
    const record: unknown = result.rows[0];
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!OrganizerModel.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return record as IOrganizerModel;
  }

  public async doesParticipantByUsernameExist(
    username: string,
  ): Promise<IRecordExistsModel> {
    const result: QueryResult = await pool.query(
      SignupQueries.DOES_PARTICIPANT_BY_$USERNAME_EXIST,
      [username],
    );
    const record: unknown = result.rows[0];
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExists.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return record;
  }

  public async doesParticipantByEmailExist(
    email: string,
  ): Promise<IRecordExistsModel> {
    const result: QueryResult = await pool.query(
      SignupQueries.DOES_PARTICIPANT_BY_$EMAIL_EXIST,
      [email],
    );
    const record: unknown = result.rows[0];
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExists.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return record;
  }

  public async createParticipant(
    username: string,
    password: string,
    email: string,
  ): Promise<IParticipantModel> {
    const result: QueryResult = await pool.query(
      SignupQueries.CREATE_PARTICIPANT_WITH_$USERNAME_$PASSWORD_$EMAIL,
      [username, password, email],
    );
    const record: unknown = result.rows[0];
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!ParticipantModel.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return record as IParticipantModel;
  }
}
