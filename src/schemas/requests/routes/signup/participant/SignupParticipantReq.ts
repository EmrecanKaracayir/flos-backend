import { ISignupParticipantReq } from "../../../../../interfaces/schemas/requests/routes/signup/participant/ISignupParticipantReq";
import { BaseSignupReq } from "../../../base/BaseSignupReq";

export class SignupParticipantReq
  extends BaseSignupReq
  implements ISignupParticipantReq {}
