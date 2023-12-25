import { UserRole } from "../../../core/@types/helpers/authPayloadRules";
import { IBaseOrganizerModel } from "../../../interfaces/models/base/IBaseOrganizerModel";
import { IBaseOrganizerRes } from "../../../interfaces/schemas/responses/base/IBaseOrganizerRes";

export class BaseOrganizerRes implements IBaseOrganizerRes {
  public readonly role: UserRole;

  constructor(
    public readonly organizerId: number,
    public readonly username: string,
    public readonly email: string,
  ) {
    this.role = "organizer";
  }

  public static fromModel(model: IBaseOrganizerModel): IBaseOrganizerRes {
    return new BaseOrganizerRes(model.organizerId, model.username, model.email);
  }

  public static fromModels(models: IBaseOrganizerModel[]): IBaseOrganizerRes[] {
    return models.map(
      (model): IBaseOrganizerRes => BaseOrganizerRes.fromModel(model),
    );
  }
}
