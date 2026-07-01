import type { AuthResponse } from '../../domain/models/auth-response.model';
import type { User } from '../../domain/models/user.model';
import { UserRole } from '../../domain/enums/user-role.enum';
import { mapBackendRoleToFrontend } from '../../domain/role-mapping';

export function mapAuthResponseToUser(res: AuthResponse): User {
  const payload = decodeJwtPayload(res.token);

  return {
    id: String(res.id),
    username: res.username,
    role: pickRole(payload['roles']),
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

function pickRole(roles: unknown): UserRole {
  if (Array.isArray(roles) && roles.length > 0) {
    return mapBackendRoleToFrontend(roles[0] as string);
  }
  return UserRole.PATIENT;
}
