import { UserRole } from "../../../../core/@types/helpers/authPayloadRules";

export interface IBaseParticipantRes {
  readonly participantId: number;
  readonly username: string;
  readonly email: string;
  readonly role: UserRole;
}
