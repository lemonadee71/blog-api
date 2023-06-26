const { NotFoundError } = require('../utils');

const ifNotFound = (message) => (err, req, res, next) => {
  if (err instanceof NotFoundError) {
    return res.status(404).json({ message: message || err.message });
  }
  next(err);
};

module.exports = { ifNotFound };
