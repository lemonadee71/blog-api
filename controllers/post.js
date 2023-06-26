const { param } = require('express-validator');
const Post = require('../models/post');
const { ifNotFound } = require('./utils');

module.exports = {
  index: {
    get: [
      param('postid').escape(),
      async (req, res, next) => {
        try {
          const post = await Post.findByShortId(req.params.postid);

          return res.json({ post: post.toSafeObject() });
        } catch (error) {
          next(error);
        }
      },
      ifNotFound(),
    ],
  },
  all: {
    get: {
      _: [
        async (req, res) => {
          let posts = await Post.find({});
          posts = (posts || []).map((post) => post.toSafeObject());

          return res.json({ posts });
        },
      ],
      byTag: [
        param('tag').escape(),
        async (req, res) => {
          let posts = await Post.findByTag(req.params.tag);
          posts = (posts || []).map((post) => post.toSafeObject());

          return res.json({ posts });
        },
      ],
      // We probably want to type coerce the query string here for cleanliness
      // See here for solution https://github.com/ljharb/qs/issues/91
      byAuthor: [
        param('username').escape(),
        async (req, res) => {
          const query = Post.findByAuthor(req.params.username);

          if (req.query.published) {
            query.where('published').equals(req.query.published === 'true');
          }

          let posts = await query.exec();
          posts = (posts || []).map((post) => post.toSafeObject());

          return res.json({ posts });
        },
      ],
    },
  },
};
