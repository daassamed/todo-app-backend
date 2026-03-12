const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const getFrontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:3000';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// ============================================
// GOOGLE OAUTH
// ============================================
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${getFrontendUrl()}/?oauth=failed&provider=google`
  }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const userData = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar
    };
    
    // Redirect to frontend with token and user data
    res.redirect(
      `${getFrontendUrl()}/?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`
    );
  }
);

// ============================================
// GITHUB OAUTH
// ============================================
router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email']
  })
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${getFrontendUrl()}/?oauth=failed&provider=github`
  }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const userData = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar
    };
    
    res.redirect(
      `${getFrontendUrl()}/?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`
    );
  }
);

module.exports = router;