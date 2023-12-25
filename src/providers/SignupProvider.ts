import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { IOrganizerModel } from "../interfaces/models/IOrganizerModel";
import { IParticipantModel } from "../interfaces/models/IParticipantModel";
import { IExistsModel } from "../interfaces/models/util/IExistsModel";
import {
  ISignupProvider,
  SignupQueries,
} from "../interfaces/providers/ISignupProvider";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
} from "../interfaces/schemas/responses/app/IServerError";
import { OrganizerModel } from "../models/OrganizerModel";
import { ParticipantModel } from "../models/ParticipantModel";
import { ExistsModel } from "../models/util/ExistsModel";

export class SignupProvider implements ISignupProvider {
  public async doesOrganizerByUsernameExist(
    username: string,
  ): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      SignupQueries.DOES_ORGANIZER_EXIST_$UNAME,
      [username],
    );
    const existsRec: unknown = existsRes.rows[0];
    if (!existsRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!ExistsModel.isValidModel(existsRec)) {
      throw new ModelMismatchError(existsRec);
    }
    return (existsRec as IExistsModel).exists;
  }

  public async doesOrganizerByEmailExist(email: string): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      SignupQueries.DOES_ORGANIZER_EXIST_$EMAIL,
      [email],
    );
    const existsRec: unknown = existsRes.rows[0];
    if (!existsRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!ExistsModel.isValidModel(existsRec)) {
      throw new ModelMismatchError(existsRec);
    }
    return (existsRec as IExistsModel).exists;
  }

  public async createOrganizer(
    username: string,
    password: string,
    email: string,
  ): Promise<IOrganizerModel> {
    const organizerRes: QueryResult = await pool.query(
      SignupQueries.CREATE_ORGANIZER_$UNAME_$PSWRD_$EMAIL,
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
  ): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      SignupQueries.DOES_PARTICIPANT_EXIST_$UNAME,
      [username],
    );
    const existsRec: unknown = existsRes.rows[0];
    if (!existsRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!ExistsModel.isValidModel(existsRec)) {
      throw new ModelMismatchError(existsRec);
    }
    return (existsRec as IExistsModel).exists;
  }

  public async doesParticipantByEmailExist(email: string): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      SignupQueries.DOES_PARTICIPANT_EXIST_$EMAIL,
      [email],
    );
    const existsRec: unknown = existsRes.rows[0];
    if (!existsRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!ExistsModel.isValidModel(existsRec)) {
      throw new ModelMismatchError(existsRec);
    }
    return (existsRec as IExistsModel).exists;
  }

  public async createParticipant(
    username: string,
    password: string,
    email: string,
  ): Promise<IParticipantModel> {
    const participantRes: QueryResult = await pool.query(
      SignupQueries.CREATE_PARTICIPANT_$UNAME_$PSWRD_$EMAIL,
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
