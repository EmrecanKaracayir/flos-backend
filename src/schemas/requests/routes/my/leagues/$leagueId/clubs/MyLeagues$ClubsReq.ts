import { IMyLeagues$ClubsReq } from "../../../../../../../interfaces/schemas/requests/routes/my/leagues/$leagueId/clubs/IMyLeagues$ClubsReq";

export class MyLeagues$ClubsReq implements IMyLeagues$ClubsReq {
  constructor(public readonly clubId: number) {}

  public static isValidReq(obj: unknown): obj is IMyLeagues$ClubsReq {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const req: IMyLeagues$ClubsReq = obj as IMyLeagues$ClubsReq;
    return typeof req.clubId === "number";
  }
}
