export interface LoginRequest {
  Username: string,
  Password: string
}

export interface LoginResponse {
  UserId: number,
  Username: string,
  FirstName: string,
  LastName: string,
  Token: string,
  Email: number
}
