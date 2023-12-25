import { IMyLeaguesReq } from "../../../../../interfaces/schemas/requests/routes/my/leagues/IMyLeaguesReq";

export class MyLeaguesReq implements IMyLeaguesReq {
  constructor(
    public readonly name: string,
    public readonly prize: number,
    public readonly description: string,
    public readonly logoPath: string,
  ) {}

  public static isValidReq(obj: unknown): obj is IMyLeaguesReq {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const req: IMyLeaguesReq = obj as IMyLeaguesReq;
    return (
      typeof req.name === "string" &&
      typeof req.prize === "number" &&
      typeof req.description === "string" &&
      typeof req.logoPath === "string"
    );
  }
}
