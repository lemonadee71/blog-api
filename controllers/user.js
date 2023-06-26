const { param } = require('express-validator');
const User = require('../models/user');
const { ifNotFound } = require('./utils');

module.exports = {
  index: {
    get: [
      param('username').toLowerCase().escape(),
      async (req, res, next) => {
        try {
          const user = await User.findByName(req.params.username);

          return res.json({ user: user.toSafeObject() });
        } catch (error) {
          next(error);
        }
      },
      ifNotFound(),
    ],
  },
  all: {
    get: [
      async (req, res) => {
        let users = await User.find({});
        users = users.map((user) => user.toSafeObject());

        return res.json({ users });
      },
    ],
  },
};
