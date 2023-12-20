import { UserRole } from "../../../../../core/@types/helpers/authPayloadRules";
import { IOrganizerModel } from "../../../../../interfaces/models/IOrganizerModel";
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

  public static fromModel(model: IOrganizerModel): ISignupOrganizerResData {
    return new SignupOrganizerResData(
      model.organizerId,
      model.username,
      model.email,
    );
  }
}
