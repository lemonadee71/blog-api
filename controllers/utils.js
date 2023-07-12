const async = require('async');
const { validationResult } = require('express-validator');
const { NotFoundError } = require('../utils');

const ifNotFound = (message) => (err, req, res, next) => {
  if (err instanceof NotFoundError) {
    return res.status(404).json({ message: message || err.message });
  }
  next(err);
};

const isLoggedIn = (req, res, next) => {
  if (req.user && req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'You must be logged in to continue' });
};

const finishValidation = () => {
  const ifSuccess = [];
  const ifHasError = [];

  async function middleware(req, res, next) {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      async.series(
        ifSuccess.map((fn) => (callback) => fn(req, res, callback)),
        (err) => {
          if (err) return next(err);
          next();
        }
      );
    } else {
      const msgs = errors.array().reduce((o, e) => {
        o[e.path] = e.msg;
        return o;
      }, {});

      async.series(
        ifHasError.map((fn) => (callback) => fn(msgs, req, res, callback)),
        (err) => {
          if (err) return next(err);
          next();
        }
      );
    }
  }

  middleware.ifSuccess = (fn) => {
    ifSuccess.push(fn);
    return middleware;
  };
  middleware.ifHasError = (fn) => {
    ifHasError.push(fn);
    return middleware;
  };

  return middleware;
};

module.exports = { ifNotFound, isLoggedIn, finishValidation };
