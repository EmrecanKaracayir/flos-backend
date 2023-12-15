import { UserRole } from "../../../../../core/@types/helpers/authPayloadRules";
import { ILoginParticipantResData } from "../../../../../interfaces/schemas/responses/routes/login/participant/ILoginParticipantResData";

export class LoginParticipantResData implements ILoginParticipantResData {
  constructor(
    public readonly participantId: number,
    public readonly username: string,
    public readonly email: string,
    public readonly role: UserRole,
  ) {}
}
