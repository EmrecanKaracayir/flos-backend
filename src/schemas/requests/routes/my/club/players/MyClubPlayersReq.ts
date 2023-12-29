import { IMyClubPlayersReq } from "../../../../../../interfaces/schemas/requests/routes/my/club/players/IMyClubPlayersReq";

export class MyClubPlayersReq implements IMyClubPlayersReq {
  constructor(public readonly playerId: number) {}

  public static isValidReq(obj: unknown): obj is IMyClubPlayersReq {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const req: IMyClubPlayersReq = obj as IMyClubPlayersReq;
    return typeof req.playerId === "number";
  }
}
