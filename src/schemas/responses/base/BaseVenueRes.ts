import { IBaseVenueModel } from "../../../interfaces/models/base/IBaseVenueModel";
import { PrecisionLossError } from "../../../interfaces/schemas/responses/app/IServerError";
import { IBaseVenueRes } from "../../../interfaces/schemas/responses/base/IBaseVenueRes";

export class BaseVenueRes implements IBaseVenueRes {
  constructor(
    public readonly venueId: number,
    public readonly name: string,
    public readonly capacity: number,
    public readonly capacityRank: number,
    public readonly email: string,
    public readonly address: string,
    public readonly imgPath: string,
  ) {}

  public static fromModel(model: IBaseVenueModel): IBaseVenueRes {
    if (!Number.isSafeInteger(Number(model.capacityRank))) {
      throw new PrecisionLossError("bigint", "number");
    }
    return new BaseVenueRes(
      model.venueId,
      model.name,
      model.capacity,
      Number(model.capacityRank),
      model.email,
      model.address,
      model.imgPath,
    );
  }

  public static fromModels(models: IBaseVenueModel[]): IBaseVenueRes[] {
    return models.map((model): IBaseVenueRes => BaseVenueRes.fromModel(model));
  }
}
