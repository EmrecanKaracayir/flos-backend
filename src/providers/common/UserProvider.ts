import { QueryResult } from "pg";
import { UserRole } from "../../core/@types/helpers/authPayloadRules";
import { pool } from "../../core/database/pool";
import { IRecordExistsModel } from "../../interfaces/models/IRecordExistsModel";
import {
  IUserProvider,
  UserQueries,
} from "../../interfaces/providers/common/IUserProvider";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
  UnexpectedUserRole,
} from "../../interfaces/schemas/responses/common/IServerError";
import { RecordExistsModel } from "../../models/RecordExistsModel";

export class UserProvider implements IUserProvider {
  private static async doesOrganizerByIdExist(
    organizerId: number,
  ): Promise<IRecordExistsModel> {
    const result: QueryResult = await pool.query(
      UserQueries.DOES_ORGANIZER_BY_$OID_EXIST,
      [organizerId],
    );
    const record: unknown = result.rows[0];
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExistsModel.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return record as IRecordExistsModel;
  }

  private static async doesParticipantByIdExist(
    participantId: number,
  ): Promise<IRecordExistsModel> {
    const result: QueryResult = await pool.query(
      UserQueries.DOES_PARTICIPANT_BY_$PID_EXIST,
      [participantId],
    );
    const record: unknown = result.rows[0];
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExistsModel.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return record as IRecordExistsModel;
  }

  public static async doesUserExist(
    userId: number,
    userRole: UserRole,
  ): Promise<IRecordExistsModel> {
    switch (userRole) {
      case "organizer":
        return await UserProvider.doesOrganizerByIdExist(userId);
      case "participant":
        return await UserProvider.doesParticipantByIdExist(userId);
      default:
        throw new UnexpectedUserRole(userRole);
    }
  }
}
