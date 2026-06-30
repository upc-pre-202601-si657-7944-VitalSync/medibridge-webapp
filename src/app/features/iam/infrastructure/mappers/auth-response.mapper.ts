import type { AuthResponse } from '../../domain/models/auth-response.model';
import type { User } from '../../domain/models/user.model';
import { UserRole } from '../../domain/enums/user-role.enum';

/**
 * Maps backend auth payloads into frontend domain models.
 * The backend now returns { id, username, token } directly.
 * We decode the JWT only to extract roles (if present).
 */
export function mapAuthResponseToUser(res: AuthResponse): User {
  const payload = decodeJwtPayload(res.token);

  return {
    id: String(res.id),
    username: res.username,
    role: pickRole(payload['roles']),
  };
}

/** Best-effort JWT payload decode (no signature verification — server owns that). */
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
    const first = (roles[0] as string).toUpperCase();
    if (Object.values(UserRole).includes(first as UserRole)) {
      return first as UserRole;
    }
  }
  return UserRole.PATIENT;
}
