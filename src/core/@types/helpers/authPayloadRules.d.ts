export type AuthPayload = {
  readonly userId: number;
  readonly userRole: UserRole;
};

export type UserRole = "organizer" | "participant";
