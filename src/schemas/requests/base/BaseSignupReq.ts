import { IBaseSignupReq } from "../../../interfaces/schemas/requests/base/IBaseSignupReq";

export class BaseSignupReq implements IBaseSignupReq {
  constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly email: string,
  ) {}

  public static isValidReq(obj: unknown): obj is IBaseSignupReq {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const req: IBaseSignupReq = obj as IBaseSignupReq;
    return (
      typeof req.username === "string" &&
      typeof req.password === "string" &&
      typeof req.email === "string"
    );
  }
}
