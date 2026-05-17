export interface LoginResponse {
  success: boolean;

  token: string;

  user: {
    id: string;
    role: string;
  };
}
