import { IBaseVenueModel } from "../../interfaces/models/base/IBaseVenueModel";

export class BaseVenueModel implements IBaseVenueModel {
  constructor(
    public readonly venueId: number,
    public readonly name: string,
    public readonly capacity: number,
    public readonly capacityRank: string,
    public readonly email: string,
    public readonly address: string,
    public readonly imgPath: string,
  ) {}

  public static isValidModel(obj: unknown): obj is IBaseVenueModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IBaseVenueModel = obj as IBaseVenueModel;
    return (
      typeof model.venueId === "number" &&
      typeof model.name === "string" &&
      typeof model.capacity === "number" &&
      typeof model.capacityRank === "string" &&
      typeof model.email === "string" &&
      typeof model.address === "string" &&
      typeof model.imgPath === "string"
    );
  }

  public static areValidModels(objs: unknown[]): objs is IBaseVenueModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => BaseVenueModel.isValidModel(obj));
  }
}
