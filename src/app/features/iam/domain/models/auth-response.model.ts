/**
 * Shape of POST /api/v1/authentication/sign-in response (real contract).
 */
export interface AuthResponse {
  readonly id: number;
  readonly username: string;
  readonly token: string;
}
