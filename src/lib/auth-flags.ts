export function getAuthFlags() {
  return {
    google: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
    email: Boolean(process.env.EMAIL_SERVER),
  };
}
