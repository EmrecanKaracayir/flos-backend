import { IVenueModel } from "../../../../interfaces/models/IVenueModel";
import { PrecisionLossError } from "../../../../interfaces/schemas/responses/common/IServerError";
import { IVenuesResData } from "../../../../interfaces/schemas/responses/routes/venues/IVenuesResData";

export class VenuesResData implements IVenuesResData {
  constructor(
    public readonly venueId: number,
    public readonly name: string,
    public readonly capacity: number,
    public readonly capacityRank: number,
    public readonly email: string,
    public readonly address: string,
    public readonly imgPath: string,
  ) {}

  public static fromModel(model: IVenueModel): IVenuesResData {
    if (!Number.isSafeInteger(Number(model.capacityRank))) {
      throw new PrecisionLossError("bigint", "number");
    }
    return new VenuesResData(
      model.venueId,
      model.name,
      model.capacity,
      Number(model.capacityRank),
      model.email,
      model.address,
      model.imgPath,
    );
  }

  public static fromModels(models: IVenueModel[]): IVenuesResData[] {
    return models.map(
      (model): IVenuesResData => VenuesResData.fromModel(model),
    );
  }
}
