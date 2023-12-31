import { IMyClubPlayerModel } from "../interfaces/models/IMyClubPlayerModel";
import { BasePlayerModel } from "./base/BasePlayerModel";

export class MyClubPlayerModel
  extends BasePlayerModel
  implements IMyClubPlayerModel
{
  constructor(
    baseModel: BasePlayerModel,
    public readonly clubId: number,
  ) {
    super(
      baseModel.playerId,
      baseModel.clubName,
      baseModel.fullName,
      baseModel.state,
      baseModel.age,
      baseModel.goals,
      baseModel.assists,
      baseModel.participantEmail,
      baseModel.biography,
      baseModel.imgPath,
    );
  }

  public static override isValidModel(obj: unknown): obj is IMyClubPlayerModel {
    if (super.isValidModel(obj) === false) {
      return false;
    }
    const model: IMyClubPlayerModel = obj as IMyClubPlayerModel;
    return typeof model.clubId === "number";
  }

  public static override areValidModels(
    objs: unknown[],
  ): objs is IMyClubPlayerModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => MyClubPlayerModel.isValidModel(obj));
  }
}
