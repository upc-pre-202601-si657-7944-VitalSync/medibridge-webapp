import type { AuthResponse } from '../../domain/models/auth-response.model';
import type { User } from '../../domain/models/user.model';
import { UserRole } from '../../domain/enums/user-role.enum';

/**
 * Maps backend auth payloads into frontend domain models.
 * Assumptions (based on the documented contracts):
 *  - The JWT `sub` claim carries the user id.
 *  - The JWT payload includes a `preferred_username` or `username` claim.
 *  - The JWT payload includes a `roles` array (at least one entry).
 *
 * If the actual backend shape differs, update this mapper in isolation.
 */
export function mapAuthResponseToUser(res: AuthResponse): User {
  const payload = decodeJwtPayload(res.accessToken);

  return {
    id: (payload['sub'] as string) ?? '',
    username:
      (payload['preferred_username'] as string) ??
      (payload['username'] as string) ??
      '',
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
