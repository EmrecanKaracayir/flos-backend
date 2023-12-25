import { UserRole } from "../../../../core/@types/helpers/authPayloadRules";

export interface IBaseOrganizerRes {
  readonly organizerId: number;
  readonly username: string;
  readonly email: string;
  readonly role: UserRole;
}
