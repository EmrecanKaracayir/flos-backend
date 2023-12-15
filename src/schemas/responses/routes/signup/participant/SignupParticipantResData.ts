import { UserRole } from "../../../../../core/@types/helpers/authPayloadRules";
import { ISignupParticipantResData } from "../../../../../interfaces/schemas/responses/routes/signup/participant/ISignupParticipantResData";

export class SignupParticipantResData implements ISignupParticipantResData {
  public readonly role: UserRole;

  constructor(
    public readonly participantId: number,
    public readonly username: string,
    public readonly email: string,
  ) {
    this.role = "participant";
  }
}
