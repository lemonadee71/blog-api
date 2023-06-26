const { param } = require('express-validator');
const Comment = require('../models/comment');

module.exports = {
  get: {
    byPost: [
      param('postid').escape(),
      async (req, res) => {
        const comments = await Comment.findByPost(req.params.postid);

        return res.json({ comments });
      },
    ],
    byAuthor: [
      param('username').escape(),
      async (req, res) => {
        const comments = await Comment.findByAuthor(req.params.username);

        return res.json({ comments });
      },
    ],
  },
};
