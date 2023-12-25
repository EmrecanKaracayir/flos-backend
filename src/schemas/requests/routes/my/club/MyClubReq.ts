import { IMyClubReq } from "../../../../../interfaces/schemas/requests/routes/my/club/IMyClubReq";

export class MyClubReq implements IMyClubReq {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly logoPath: string,
  ) {}

  public static isValidReq(obj: unknown): obj is IMyClubReq {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const req: IMyClubReq = obj as IMyClubReq;
    return (
      typeof req.name === "string" &&
      typeof req.description === "string" &&
      typeof req.logoPath === "string"
    );
  }
}
