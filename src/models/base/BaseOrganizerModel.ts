import { IBaseOrganizerModel } from "../../interfaces/models/base/IBaseOrganizerModel";

export class BaseOrganizerModel implements IBaseOrganizerModel {
  constructor(
    public readonly organizerId: number,
    public readonly username: string,
    public readonly password: string,
    public readonly email: string,
  ) {}

  public static isValidModel(obj: unknown): obj is IBaseOrganizerModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IBaseOrganizerModel = obj as IBaseOrganizerModel;
    return (
      typeof model.organizerId === "number" &&
      typeof model.username === "string" &&
      typeof model.password === "string" &&
      typeof model.email === "string"
    );
  }

  public static areValidModels(objs: unknown[]): objs is IBaseOrganizerModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => BaseOrganizerModel.isValidModel(obj));
  }
}
