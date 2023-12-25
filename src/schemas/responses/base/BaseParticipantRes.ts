import { UserRole } from "../../../core/@types/helpers/authPayloadRules";
import { IBaseParticipantModel } from "../../../interfaces/models/base/IBaseParticipantModel";
import { IBaseParticipantRes } from "../../../interfaces/schemas/responses/base/IBaseParticipantRes";

export class BaseParticipantRes implements IBaseParticipantRes {
  public readonly role: UserRole;

  constructor(
    public readonly participantId: number,
    public readonly username: string,
    public readonly email: string,
  ) {
    this.role = "participant";
  }

  public static fromModel(model: IBaseParticipantModel): IBaseParticipantRes {
    return new BaseParticipantRes(
      model.participantId,
      model.username,
      model.email,
    );
  }

  public static fromModels(
    models: IBaseParticipantModel[],
  ): IBaseParticipantRes[] {
    return models.map(
      (model): IBaseParticipantRes => BaseParticipantRes.fromModel(model),
    );
  }
}
