import { IVenueModel } from "../../../../interfaces/models/IVenueModel";
import { IVenuesResData } from "../../../../interfaces/schemas/responses/routes/venues/IVenuesResData";

export class VenuesResData implements IVenuesResData {
  constructor(
    public readonly venueId: number,
    public readonly name: string,
    public readonly capacity: number,
    public readonly address: string,
    public readonly email: string,
    public readonly imgPath: string,
  ) {}

  public static fromModel(venueModel: IVenueModel): IVenuesResData {
    return new VenuesResData(
      venueModel.venueId,
      venueModel.name,
      venueModel.capacity,
      venueModel.address,
      venueModel.email,
      venueModel.imgPath,
    );
  }

  public static fromModels(venueModels: IVenueModel[]): IVenuesResData[] {
    return venueModels.map(
      (venueModel): IVenuesResData => VenuesResData.fromModel(venueModel),
    );
  }
}
