import { ILoginOrganizerReqDto } from "../../../../../interfaces/schemas/requests/routes/login/organizer/ILoginOrganizerReqDto";

export class LoginOrganizerReqDto implements ILoginOrganizerReqDto {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}

  public static isValidDto(obj: unknown): obj is ILoginOrganizerReqDto {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const dto: LoginOrganizerReqDto = obj as ILoginOrganizerReqDto;
    return typeof dto.username === "string" && typeof dto.password === "string";
  }
}
