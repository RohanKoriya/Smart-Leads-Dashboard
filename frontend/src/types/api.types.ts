export interface LoginResponse {
  success: boolean;

  token: string;

  user: {
    id: string;
    name: string;
    role: string;
  };
}
