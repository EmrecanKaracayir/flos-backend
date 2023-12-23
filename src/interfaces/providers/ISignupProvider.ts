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
  DOES_ORGANIZER_BY_$USERNAME_EXIST = `SELECT EXISTS (SELECT * FROM "Organizer" WHERE username = $1) AS "recordExists"`,
  DOES_ORGANIZER_BY_$EMAIL_EXIST = `SELECT EXISTS (SELECT * FROM "Organizer" WHERE email = $1) AS "recordExists"`,
  CREATE_ORGANIZER_WITH_$USERNAME_$PASSWORD_$EMAIL = `INSERT INTO "Organizer" (username, password, email) VALUES ($1, $2, $3) RETURNING *`,
  DOES_PARTICIPANT_BY_$USERNAME_EXIST = `SELECT EXISTS (SELECT * FROM "Participant" WHERE username = $1) AS "recordExists"`,
  DOES_PARTICIPANT_BY_$EMAIL_EXIST = `SELECT EXISTS (SELECT * FROM "Participant" WHERE email = $1) AS "recordExists"`,
  CREATE_PARTICIPANT_WITH_$USERNAME_$PASSWORD_$EMAIL = `INSERT INTO "Participant" (username, password, email) VALUES ($1, $2, $3) RETURNING *`,
}
