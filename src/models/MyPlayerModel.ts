import { IMyPlayerModel } from "../interfaces/models/IMyPlayerModel";
import { BasePlayerModel } from "./base/BasePlayerModel";

export class MyPlayerModel extends BasePlayerModel implements IMyPlayerModel {
  constructor(
    baseModel: BasePlayerModel,
    public readonly participantId: number,
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

  public static override isValidModel(obj: unknown): obj is IMyPlayerModel {
    if (super.isValidModel(obj) === false) {
      return false;
    }
    const model: IMyPlayerModel = obj as IMyPlayerModel;
    return typeof model.participantId === "number";
  }

  public static override areValidModels(
    objs: unknown[],
  ): objs is IMyPlayerModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => MyPlayerModel.isValidModel(obj));
  }
}
