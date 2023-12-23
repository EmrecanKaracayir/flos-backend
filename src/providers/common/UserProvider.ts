import { QueryResult } from "pg";
import { UserRole } from "../../core/@types/helpers/authPayloadRules";
import { pool } from "../../core/database/pool";
import { IRecordExistsModel } from "../../interfaces/models/common/IRecordExistsModel";
import {
  IUserProvider,
  UserQueries,
} from "../../interfaces/providers/common/IUserProvider";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
  UnexpectedUserRole,
} from "../../interfaces/schemas/responses/common/IServerError";
import { RecordExistsModel } from "../../models/common/RecordExistsModel";

export class UserProvider implements IUserProvider {
  private static async doesOrganizerByIdExist(
    organizerId: number,
  ): Promise<IRecordExistsModel> {
    const reRes: QueryResult = await pool.query(
      UserQueries.DOES_ORGANIZER_EXIST_$ORID,
      [organizerId],
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

  private static async doesParticipantByIdExist(
    participantId: number,
  ): Promise<IRecordExistsModel> {
    const reRes: QueryResult = await pool.query(
      UserQueries.DOES_PARTICIPANT_EXIST_$PRID,
      [participantId],
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
