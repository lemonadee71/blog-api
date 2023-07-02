const { body, validationResult } = require('express-validator');
const passport = require('passport');

module.exports = {
  isAuthenticated: (req, res) => {
    if (req.user && req.isAuthenticated()) {
      return res.json({
        user: req.user,
        message: 'User is authenticated',
      });
    }

    return res.json({
      message: 'User is not authenticated',
    });
  },
  login: [
    body('username')
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Username can't be empty"),
    body('password').trim().notEmpty().withMessage("Password can't be empty"),
    (req, res, next) => {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        passport.authenticate('local', (err, user) => {
          if (err) {
            return res.json({ success: false, message: err.message });
          }

          if (!user) {
            return res.json({
              success: false,
              message: 'User does not exist',
            });
          }

          req.login(user, next);
        })(req, res, next);
      } else {
        return res.json({
          success: false,
          message: errors.array().map((e) => e.msg),
        });
      }
    },
    (req, res) => res.json({ success: true, message: 'Login success!' }),
  ],
  logout: [
    (req, res, next) => {
      req.logout((err) => {
        if (err) return next(err);
        return res.json({ success: true, message: 'Log out success!' });
      });
    },
    // BUG: This is not catching the error
    (err, req, res, next) => res.json({ success: false, message: err.message }),
  ],
};
