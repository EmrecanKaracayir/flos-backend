import { UserRole } from "../../../../../core/@types/helpers/authPayloadRules";
import { IParticipantModel } from "../../../../../interfaces/models/IParticipantModel";
import { ILoginParticipantResData } from "../../../../../interfaces/schemas/responses/routes/login/participant/ILoginParticipantResData";

export class LoginParticipantResData implements ILoginParticipantResData {
  public readonly role: UserRole;

  constructor(
    public readonly participantId: number,
    public readonly username: string,
    public readonly email: string,
  ) {
    this.role = "participant";
  }

  public static fromModel(
    participantModel: IParticipantModel,
  ): ILoginParticipantResData {
    return new LoginParticipantResData(
      participantModel.participantId,
      participantModel.username,
      participantModel.email,
    );
  }
}
