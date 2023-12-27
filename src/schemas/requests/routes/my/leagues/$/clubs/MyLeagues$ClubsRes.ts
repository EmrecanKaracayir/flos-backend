import { IMyLeagues$ClubsReq } from "../../../../../../../interfaces/schemas/requests/routes/my/leagues/$/clubs/IMyLeagues$ClubsReq";

export class MyLeagues$ClubsReq implements IMyLeagues$ClubsReq {
  constructor(public readonly clubIds: number[]) {}

  public static isValidReq(obj: unknown): obj is IMyLeagues$ClubsReq {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const req: IMyLeagues$ClubsReq = obj as IMyLeagues$ClubsReq;
    if (!Array.isArray(req.clubIds)) {
      return false;
    }
    return req.clubIds.every((clubId): boolean => typeof clubId === "number");
  }
}
