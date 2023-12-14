import { ILoginOrganizer } from "../../../../../interfaces/schemas/requests/routes/login/organizer/ILoginOrganizer";

export class LoginOrganizer implements ILoginOrganizer {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}

  public static isValidDto(obj: unknown): obj is ILoginOrganizer {
    const loginParticipant: LoginOrganizer = obj as ILoginOrganizer;

    return (
      typeof loginParticipant.username === "string" &&
      typeof loginParticipant.password === "string"
    );
  }
}
