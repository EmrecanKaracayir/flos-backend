import { IMyPlayerReq } from "../../../../../interfaces/schemas/requests/routes/my/player/IMyPlayerReq";

export class MyPlayerReq implements IMyPlayerReq {
  constructor(
    public readonly fullName: string,
    public readonly birthday: string,
    public readonly biography: string,
    public readonly imgPath: string,
  ) {}

  public static isValidReq(obj: unknown): obj is IMyPlayerReq {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const req: IMyPlayerReq = obj as IMyPlayerReq;
    return (
      typeof req.fullName === "string" &&
      typeof req.birthday === "string" &&
      typeof req.biography === "string" &&
      typeof req.imgPath === "string"
    );
  }
}
