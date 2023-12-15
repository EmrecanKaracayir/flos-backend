import { UserRole } from "../../../../../core/@types/helpers/authPayloadRules";
import { ILoginOrganizerResData } from "../../../../../interfaces/schemas/responses/routes/login/organizer/ILoginOrganizerResData";

export class LoginOrganizerResData implements ILoginOrganizerResData {
  public readonly role: UserRole;

  constructor(
    public readonly organizerId: number,
    public readonly username: string,
    public readonly email: string,
  ) {
    this.role = "organizer";
  }
}
