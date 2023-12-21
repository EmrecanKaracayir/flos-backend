import { PlayerState } from "../../../../core/enums/playerState";
import { IPlayerModel } from "../../../../interfaces/models/IPlayerModel";
import { IPlayersResData } from "../../../../interfaces/schemas/responses/routes/players/IPlayersResData";

export class PlayersResData implements IPlayersResData {
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

  public static fromModel(model: IPlayerModel): IPlayersResData {
    return new PlayersResData(
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

  public static fromModels(models: IPlayerModel[]): IPlayersResData[] {
    return models.map(
      (model): IPlayersResData => PlayersResData.fromModel(model),
    );
  }
}
