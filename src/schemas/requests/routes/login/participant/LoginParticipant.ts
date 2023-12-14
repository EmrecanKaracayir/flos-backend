import { ILoginParticipant } from "../../../../../interfaces/schemas/requests/routes/login/participant/ILoginParticipant";

export class LoginParticipant implements ILoginParticipant {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}

  public static isValidDto(obj: unknown): obj is ILoginParticipant {
    const loginParticipant: LoginParticipant = obj as ILoginParticipant;

    return (
      typeof loginParticipant.username === "string" &&
      typeof loginParticipant.password === "string"
    );
  }
}
