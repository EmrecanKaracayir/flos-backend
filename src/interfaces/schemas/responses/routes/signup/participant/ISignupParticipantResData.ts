import { UserRole } from "../../../../../../core/@types/helpers/authPayloadRules";

export interface ISignupParticipantResData {
  readonly participantId: number;
  readonly username: string;
  readonly email: string;
  readonly role: UserRole;
}
