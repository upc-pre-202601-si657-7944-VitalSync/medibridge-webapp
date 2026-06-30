import { UserRole } from '../enums/user-role.enum';

export interface SignUpRequest {
  username: string;
  password: string;
  role: UserRole;
}
