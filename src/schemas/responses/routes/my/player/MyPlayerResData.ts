import { PlayerState } from "../../../../../core/enums/playerState";
import { IMyPlayerModel } from "../../../../../interfaces/models/IMyPlayerModel";
import { IMyPlayerResData } from "../../../../../interfaces/schemas/responses/routes/my/player/IMyPlayerResData";

export class MyPlayerResData implements IMyPlayerResData {
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

  public static fromModel(model: IMyPlayerModel): IMyPlayerResData {
    return new MyPlayerResData(
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
}
