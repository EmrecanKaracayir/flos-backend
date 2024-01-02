import { PlayerState } from "../../../core/enums/playerState";
import { IBasePlayerModel } from "../../../interfaces/models/base/IBasePlayerModel";
import { PrecisionLossError } from "../../../interfaces/schemas/responses/app/IServerError";
import { IBasePlayerRes } from "../../../interfaces/schemas/responses/base/IBasePlayerRes";

export class BasePlayerRes implements IBasePlayerRes {
  constructor(
    public readonly playerId: number,
    public readonly clubName: string | null,
    public readonly fullName: string,
    public readonly state: PlayerState,
    public readonly age: number,
    public readonly goals: number,
    public readonly assists: number,
    public readonly email: string,
    public readonly biography: string,
    public readonly imgPath: string,
  ) {}

  public static fromModel(model: IBasePlayerModel): IBasePlayerRes {
    if (!Number.isSafeInteger(Number(model.goals))) {
      throw new PrecisionLossError("bigint", "number");
    }
    if (!Number.isSafeInteger(Number(model.assists))) {
      throw new PrecisionLossError("bigint", "number");
    }
    return new BasePlayerRes(
      model.playerId,
      model.clubName,
      model.fullName,
      model.state,
      model.age,
      Number(model.goals),
      Number(model.assists),
      model.participantEmail,
      model.biography,
      model.imgPath,
    );
  }

  public static fromModels(models: IBasePlayerModel[]): IBasePlayerRes[] {
    return models.map(
      (model): IBasePlayerRes => BasePlayerRes.fromModel(model),
    );
  }
}
