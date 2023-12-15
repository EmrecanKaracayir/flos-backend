import { ILoginParticipantReqDto } from "../../../../../interfaces/schemas/requests/routes/login/participant/ILoginParticipantReqDto";

export class LoginParticipantReqDto implements ILoginParticipantReqDto {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}

  public static isValidDto(obj: unknown): obj is ILoginParticipantReqDto {
    const dto: LoginParticipantReqDto = obj as ILoginParticipantReqDto;

    return typeof dto.username === "string" && typeof dto.password === "string";
  }
}
