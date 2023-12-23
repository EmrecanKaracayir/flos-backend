export interface IUserProvider {}

export enum UserQueries {
  DOES_ORGANIZER_BY_$OID_EXIST = `SELECT EXISTS (SELECT * FROM "Organizer" WHERE "organizerId" = $1) AS "recordExists"`,
  DOES_PARTICIPANT_BY_$PID_EXIST = `SELECT EXISTS (SELECT * FROM "Participant" WHERE "participantId" = $1) AS "recordExists"`,
}
