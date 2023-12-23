import { IOrganizerModel } from "../models/IOrganizerModel";
import { IParticipantModel } from "../models/IParticipantModel";
import { IRecordExistsModel } from "../models/common/IRecordExistsModel";

export interface ISignupProvider {
  doesOrganizerByUsernameExist: (
    username: string,
  ) => Promise<IRecordExistsModel>;

  doesOrganizerByEmailExist: (email: string) => Promise<IRecordExistsModel>;

  createOrganizer: (
    username: string,
    password: string,
    email: string,
  ) => Promise<IOrganizerModel>;

  doesParticipantByUsernameExist: (
    username: string,
  ) => Promise<IRecordExistsModel>;

  doesParticipantByEmailExist: (
    username: string,
  ) => Promise<IRecordExistsModel>;

  createParticipant: (
    username: string,
    password: string,
    email: string,
  ) => Promise<IParticipantModel>;
}

export enum SignupQueries {
  DOES_ORGANIZER_EXIST_$UNAME = `SELECT EXISTS (SELECT * FROM "Organizer" WHERE username = $1) AS "recordExists"`,
  DOES_ORGANIZER_EXIST_$EMAIL = `SELECT EXISTS (SELECT * FROM "Organizer" WHERE email = $1) AS "recordExists"`,
  CREATE_ORGANIZER_$UNAME_$PSWRD_$EMAIL = `INSERT INTO "Organizer" (username, password, email) VALUES ($1, $2, $3) RETURNING *`,
  DOES_PARTICIPANT_EXIST_$UNAME = `SELECT EXISTS (SELECT * FROM "Participant" WHERE username = $1) AS "recordExists"`,
  DOES_PARTICIPANT_EXIST_$EMAIL = `SELECT EXISTS (SELECT * FROM "Participant" WHERE email = $1) AS "recordExists"`,
  CREATE_PARTICIPANT_$UNAME_$PSWRD_$EMAIL = `INSERT INTO "Participant" (username, password, email) VALUES ($1, $2, $3) RETURNING *`,
}
