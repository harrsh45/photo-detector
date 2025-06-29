import passport from '../config/passport.js';

export const googleAuthController = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

export const googleAuthCallbackController = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user) => {
    if (err) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
    }

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
    }

    try {
      // Generate JWT token
      const token = await user.generateJWT();

      // Redirect to frontend with token
      return res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${token}`);
    } catch (error) {
      console.error('Error in Google auth callback:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
    }
  })(req, res, next);
};