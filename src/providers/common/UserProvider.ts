import { QueryResult } from "pg";
import { UserRole } from "../../core/@types/helpers/authPayloadRules";
import { pool } from "../../core/database/pool";
import { IExistsModel } from "../../interfaces/models/util/IExistsModel";
import {
  IUserProvider,
  UserQueries,
} from "../../interfaces/providers/common/IUserProvider";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
  UnexpectedUserRole,
} from "../../interfaces/schemas/responses/app/IServerError";
import { ExistsModel } from "../../models/util/ExistsModel";

export class UserProvider implements IUserProvider {
  private static async doesOrganizerByIdExist(
    organizerId: number,
  ): Promise<IExistsModel> {
    const existsRes: QueryResult = await pool.query(
      UserQueries.DOES_ORGANIZER_EXIST_$ORID,
      [organizerId],
    );
    const existsRec: unknown = existsRes.rows[0];
    if (!existsRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!ExistsModel.isValidModel(existsRec)) {
      throw new ModelMismatchError(existsRec);
    }
    return existsRec as IExistsModel;
  }

  private static async doesParticipantByIdExist(
    participantId: number,
  ): Promise<IExistsModel> {
    const existsRes: QueryResult = await pool.query(
      UserQueries.DOES_PARTICIPANT_EXIST_$PRID,
      [participantId],
    );
    const existsRec: unknown = existsRes.rows[0];
    if (!existsRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!ExistsModel.isValidModel(existsRec)) {
      throw new ModelMismatchError(existsRec);
    }
    return existsRec as IExistsModel;
  }

  public static async doesUserExist(
    userId: number,
    userRole: UserRole,
  ): Promise<IExistsModel> {
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
