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

  public static fromModel(venueModel: IVenueModel): IVenuesResData {
    if (!Number.isSafeInteger(Number(venueModel.capacityRank))) {
      throw new PrecisionLossError("bigint", "number");
    }
    return new VenuesResData(
      venueModel.venueId,
      venueModel.name,
      venueModel.capacity,
      Number(venueModel.capacityRank),
      venueModel.email,
      venueModel.address,
      venueModel.imgPath,
    );
  }

  public static fromModels(venueModels: IVenueModel[]): IVenuesResData[] {
    return venueModels.map(
      (venueModel): IVenuesResData => VenuesResData.fromModel(venueModel),
    );
  }
}
