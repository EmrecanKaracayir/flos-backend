import { UserRole } from "../../../../../../core/@types/helpers/authPayloadRules";

export interface ILoginOrganizerResData {
  readonly organizerId: number;
  readonly username: string;
  readonly email: string;
  readonly role: UserRole;
}
