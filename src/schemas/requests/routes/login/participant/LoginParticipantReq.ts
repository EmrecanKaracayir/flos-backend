import { ILoginParticipantReq } from "../../../../../interfaces/schemas/requests/routes/login/participant/ILoginParticipantReq";
import { BaseLoginReq } from "../../../base/BaseLoginReq";

export class LoginParticipantReq
  extends BaseLoginReq
  implements ILoginParticipantReq {}
