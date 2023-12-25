import { IMyLeagueModel } from "../interfaces/models/IMyLeagueModel";
import { IBaseLeagueModel } from "../interfaces/models/base/IBaseLeagueModel";
import { BaseLeagueModel } from "./base/BaseLeagueModel";

export class MyLeagueModel extends BaseLeagueModel implements IMyLeagueModel {
  constructor(
    baseModel: IBaseLeagueModel,
    public readonly organizerId: number,
  ) {
    super(
      baseModel.leagueId,
      baseModel.name,
      baseModel.state,
      baseModel.prize,
      baseModel.organizerEmail,
      baseModel.description,
      baseModel.logoPath,
    );
  }

  public static override isValidModel(obj: unknown): obj is IMyLeagueModel {
    if (super.isValidModel(obj) === false) {
      return false;
    }
    const model: IMyLeagueModel = obj as IMyLeagueModel;
    return typeof model.organizerId === "number";
  }

  public static override areValidModels(
    objs: unknown[],
  ): objs is IMyLeagueModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => MyLeagueModel.isValidModel(obj));
  }
}
