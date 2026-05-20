export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  username: string
  email: string
  role: string
  full_name: string
}

export interface UserProfile {
  id: string
  username: string
  email: string
  role: string
  full_name: string
  is_active: boolean
  created_at: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
  full_name: string
}

export interface LoginPayload {
  username: string
  password: string
}
