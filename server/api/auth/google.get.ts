import { H3Event } from 'h3'
import { type GoogleUser } from '@/types/interfaces'

console.log('Google OAuth handler initialized')

export default defineOAuthGoogleEventHandler({
  config: {
    scope: ["openid", "email", "profile"],
  },
  async onSuccess(event: H3Event, { user }: { user: GoogleUser }) {
    console.log('Google OAuth success for user:', user.email)
    await setUserSession(event, {
      user: {
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      loggedInAt: new Date(),
    })
    console.log('User session set, redirecting to home')
    return sendRedirect(event, "/")
  },
  onError(event: H3Event, error: Error) {
    console.error("Google OAuth error:", error)
    console.error("Error stack:", error.stack)
    return sendRedirect(event, "/login?error=oauth_error")
  },
})