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
    const { organizerId, username, password, email } = obj as IOrganizerModel;
    return (
      typeof organizerId === "number" &&
      typeof username === "string" &&
      typeof password === "string" &&
      typeof email === "string"
    );
  }
}
