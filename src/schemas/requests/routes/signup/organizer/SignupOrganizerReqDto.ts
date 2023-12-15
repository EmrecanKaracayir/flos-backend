import { ISignupOrganizerReqDto } from "../../../../../interfaces/schemas/requests/routes/signup/organizer/ISignupOrganizerReqDto";

export class SignupOrganizerReqDto implements ISignupOrganizerReqDto {
  constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly email: string,
  ) {}

  public static isValidDto(obj: unknown): obj is ISignupOrganizerReqDto {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const dto: SignupOrganizerReqDto = obj as ISignupOrganizerReqDto;
    return (
      typeof dto.username === "string" &&
      typeof dto.password === "string" &&
      typeof dto.email === "string"
    );
  }
}
