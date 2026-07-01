import { UserRole } from './enums/user-role.enum';

export const BackendRole = {
  ROLE_USER: 'ROLE_USER',
  ROLE_ADMIN: 'ROLE_ADMIN',
} as const;

export type BackendRole = (typeof BackendRole)[keyof typeof BackendRole];

export function mapFrontendRoleToBackend(_frontendRole: UserRole): string {
  return BackendRole.ROLE_USER;
}

const BACKEND_TO_FRONTEND: Record<string, UserRole> = {
  [BackendRole.ROLE_USER]: UserRole.PATIENT,
  [BackendRole.ROLE_ADMIN]: UserRole.PATIENT,
};

export function mapBackendRoleToFrontend(backendRole: string): UserRole {
  const upperRole = backendRole.toUpperCase();
  return BACKEND_TO_FRONTEND[upperRole] ?? UserRole.PATIENT;
}
