export function getAuthFlags() {
  const hasDemo =
    Boolean(process.env.DEMO_LOGIN_PASSWORD && process.env.DEMO_LOGIN_EMAILS) ||
    Boolean(process.env.ALLOWED_LOGIN_EMAIL && process.env.ALLOWED_LOGIN_PASSWORD);
  return {
    google: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
    email: Boolean(process.env.EMAIL_SERVER),
    demo: hasDemo,
  };
}
