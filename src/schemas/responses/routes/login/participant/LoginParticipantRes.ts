import { ILoginParticipantRes } from "../../../../../interfaces/schemas/responses/routes/login/participant/ILoginParticipantRes";
import { BaseParticipantRes } from "../../../base/BaseParticipantRes";

export class LoginParticipantRes
  extends BaseParticipantRes
  implements ILoginParticipantRes {}
