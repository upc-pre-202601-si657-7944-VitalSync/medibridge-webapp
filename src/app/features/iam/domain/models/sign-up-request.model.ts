import { UserRole } from '../enums/user-role.enum';

export interface SignUpRequest {
  username: string;
  password: string;
  roles: string[];
  frontendRole: UserRole;
}
