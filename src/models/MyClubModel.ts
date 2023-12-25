import { IMyClubModel } from "../interfaces/models/IMyClubModel";
import { IBaseClubModel } from "../interfaces/models/base/IBaseClubModel";
import { BaseClubModel } from "./base/BaseClubModel";

export class MyClubModel extends BaseClubModel implements IMyClubModel {
  constructor(
    baseModel: IBaseClubModel,
    public readonly participantId: number,
  ) {
    super(
      baseModel.clubId,
      baseModel.name,
      baseModel.state,
      baseModel.playerCount,
      baseModel.cupCount,
      baseModel.participantEmail,
      baseModel.description,
      baseModel.logoPath,
    );
  }

  public static override isValidModel(obj: unknown): obj is IMyClubModel {
    if (super.isValidModel(obj) === false) {
      return false;
    }
    const model: IMyClubModel = obj as IMyClubModel;
    return typeof model.participantId === "number";
  }

  public static override areValidModels(
    objs: unknown[],
  ): objs is IMyClubModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => MyClubModel.isValidModel(obj));
  }
}
