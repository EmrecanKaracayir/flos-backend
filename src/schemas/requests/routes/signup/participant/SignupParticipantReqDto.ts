import { ISignupParticipantReqDto } from "../../../../../interfaces/schemas/requests/routes/signup/participant/ISignupParticipantReqDto";

export class SignupParticipantReqDto implements ISignupParticipantReqDto {
  constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly email: string,
  ) {}

  public static isValidDto(obj: unknown): obj is ISignupParticipantReqDto {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const dto: SignupParticipantReqDto = obj as ISignupParticipantReqDto;
    return (
      typeof dto.username === "string" &&
      typeof dto.password === "string" &&
      typeof dto.email === "string"
    );
  }
}
