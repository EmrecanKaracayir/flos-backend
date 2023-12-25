import { PlayerState } from "../../../core/enums/playerState";
import { IBasePlayerModel } from "../../../interfaces/models/base/IBasePlayerModel";
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
    return new BasePlayerRes(
      model.playerId,
      model.clubName,
      model.fullName,
      model.state,
      model.age,
      model.goals,
      model.assists,
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
