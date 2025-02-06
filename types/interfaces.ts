export interface GoogleUser {
  email: string
  email_verified: boolean
  name: string
  picture: string
  given_name: string
  family_name: string
  locale: string
}

export interface DBUser {
  email: string
  name: string
  picture: string
}
