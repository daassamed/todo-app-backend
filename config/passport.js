const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const User = require('../models/User');

const getBackendUrl = () => {
  if (process.env.BACKEND_URL) return process.env.BACKEND_URL.replace(/\/+$/, '');
  const port = process.env.PORT || 5000;
  return `http://localhost:${port}`;
};

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ============================================
// GOOGLE STRATEGY
// ============================================
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${getBackendUrl()}/api/auth/google/callback`
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ 
            $or: [
              { googleId: profile.id },
              { email: profile.emails[0].value }
            ]
          });

          if (user) {
            // Update Google ID if not set
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          // Create new user
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            avatar: profile.photos[0].value,
            password: 'OAUTH_USER_' + Math.random().toString(36) // Random password for OAuth users
          });

          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
} else {
  console.warn('Google OAuth disabled: missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET');
}

// ============================================
// GITHUB STRATEGY
// ============================================
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/api/auth/github/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ 
            $or: [
              { githubId: profile.id },
              { email: profile.emails?.[0]?.value }
            ]
          });

          if (user) {
            if (!user.githubId) {
              user.githubId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          user = await User.create({
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
            githubId: profile.id,
            avatar: profile.photos?.[0]?.value,
            password: 'OAUTH_USER_' + Math.random().toString(36)
          });

          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
} else {
  console.warn('GitHub OAuth disabled: missing GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET');
}

module.exports = passport;