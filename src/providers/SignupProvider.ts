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
  ): Promise<boolean> {
    const reRes: QueryResult = await pool.query(
      SignupQueries.DOES_ORGANIZER_EXIST_$UNAME,
      [username],
    );
    const reRec: unknown = reRes.rows[0];
    if (!reRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExistsModel.isValidModel(reRec)) {
      throw new ModelMismatchError(reRec);
    }
    return (reRec as IRecordExistsModel).recordExists;
  }

  public async doesOrganizerByEmailExist(email: string): Promise<boolean> {
    const reRes: QueryResult = await pool.query(
      SignupQueries.DOES_ORGANIZER_EXIST_$EMAIL,
      [email],
    );
    const reRec: unknown = reRes.rows[0];
    if (!reRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExistsModel.isValidModel(reRec)) {
      throw new ModelMismatchError(reRec);
    }
    return (reRec as IRecordExistsModel).recordExists;
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
    const reRes: QueryResult = await pool.query(
      SignupQueries.DOES_PARTICIPANT_EXIST_$UNAME,
      [username],
    );
    const reRec: unknown = reRes.rows[0];
    if (!reRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExistsModel.isValidModel(reRec)) {
      throw new ModelMismatchError(reRec);
    }
    return (reRec as IRecordExistsModel).recordExists;
  }

  public async doesParticipantByEmailExist(email: string): Promise<boolean> {
    const reRes: QueryResult = await pool.query(
      SignupQueries.DOES_PARTICIPANT_EXIST_$EMAIL,
      [email],
    );
    const reRec: unknown = reRes.rows[0];
    if (!reRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExistsModel.isValidModel(reRec)) {
      throw new ModelMismatchError(reRec);
    }
    return (reRec as IRecordExistsModel).recordExists;
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
