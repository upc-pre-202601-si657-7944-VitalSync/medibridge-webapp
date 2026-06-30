/**
 * Shape of POST /api/v1/authentication/sign-in response.
 * `expiresIn` is in seconds.
 */
export interface AuthResponse {
  readonly accessToken: string;
  readonly tokenType: 'Bearer';
  readonly expiresIn: number;
}
