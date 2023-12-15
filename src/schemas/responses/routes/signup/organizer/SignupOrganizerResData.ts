import { UserRole } from "../../../../../core/@types/helpers/authPayloadRules";
import { ISignupOrganizerResData } from "../../../../../interfaces/schemas/responses/routes/signup/organizer/ISignupOrganizerResData";

export class SignupOrganizerResData implements ISignupOrganizerResData {
  public readonly role: UserRole;

  constructor(
    public readonly organizerId: number,
    public readonly username: string,
    public readonly email: string,
  ) {
    this.role = "organizer";
  }
}
