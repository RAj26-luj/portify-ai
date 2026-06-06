export const securityConfig = {
  bcryptRounds: 12,

  jwtMaxAge:
    30 * 24 * 60 * 60,

  verificationTokenAge:
    24 * 60 * 60 * 1000,

  resetTokenAge:
    60 * 60 * 1000,
};