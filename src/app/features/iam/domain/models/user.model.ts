import { UserRole } from '../enums/user-role.enum';

/** Represents the authenticated user as understood by the frontend. */
export interface User {
  readonly id: string;
  readonly username: string;
  readonly role: UserRole;
}
