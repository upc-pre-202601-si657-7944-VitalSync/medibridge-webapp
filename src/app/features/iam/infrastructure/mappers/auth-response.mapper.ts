import type { AuthResponse } from '../../domain/models/auth-response.model';
import type { User } from '../../domain/models/user.model';
import { UserRole } from '../../domain/enums/user-role.enum';
import { mapBackendRoleToFrontend } from '../../domain/role-mapping';

const ROLE_STORAGE_KEY = 'mb_user_roles';

export function mapAuthResponseToUser(res: AuthResponse): User {
  const payload = decodeJwtPayload(res.token);

  return {
    id: String(res.id),
    username: res.username,
    role: pickRole(payload['roles'], res.username),
  };
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return {};
    return JSON.parse(atob(parts[1])) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function pickRole(roles: unknown, username: string): UserRole {
  if (Array.isArray(roles) && roles.length > 0) {
    return mapBackendRoleToFrontend(roles[0] as string);
  }
  return lookupStoredRole(username);
}

function lookupStoredRole(username: string): UserRole {
  try {
    const raw = localStorage.getItem(ROLE_STORAGE_KEY);
    if (!raw) return UserRole.FAMILY_MEMBER;
    const map = JSON.parse(raw) as Record<string, string>;
    const stored = map[username];
    return Object.values(UserRole).includes(stored as UserRole)
      ? (stored as UserRole)
      : UserRole.FAMILY_MEMBER;
  } catch {
    return UserRole.FAMILY_MEMBER;
  }
}
