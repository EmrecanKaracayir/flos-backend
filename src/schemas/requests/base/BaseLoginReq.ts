import { IBaseLoginReq } from "../../../interfaces/schemas/requests/base/IBaseLoginReq";

export class BaseLoginReq implements IBaseLoginReq {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}

  public static isValidReq(obj: unknown): obj is IBaseLoginReq {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const req: IBaseLoginReq = obj as IBaseLoginReq;
    return typeof req.username === "string" && typeof req.password === "string";
  }
}
