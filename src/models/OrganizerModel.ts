import { IOrganizerModel } from "../interfaces/models/IOrganizerModel";

export class OrganizerModel implements IOrganizerModel {
  constructor(
    public readonly organizerId: number,
    public readonly username: string,
    public readonly password: string,
    public readonly email: string,
  ) {}

  public static isValidModel(obj: unknown): obj is IOrganizerModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IOrganizerModel = obj as IOrganizerModel;
    return (
      typeof model.organizerId === "number" &&
      typeof model.username === "string" &&
      typeof model.password === "string" &&
      typeof model.email === "string"
    );
  }
}
