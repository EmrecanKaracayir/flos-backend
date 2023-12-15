import { UserRole } from "../../../../../core/@types/helpers/authPayloadRules";
import { ILoginOrganizerResData } from "../../../../../interfaces/schemas/responses/routes/login/organizer/ILoginOrganizerResData";

export class LoginOrganizerResData implements ILoginOrganizerResData {
  constructor(
    public readonly organizerId: number,
    public readonly username: string,
    public readonly email: string,
    public readonly role: UserRole,
  ) {}
}
