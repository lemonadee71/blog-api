const { param, body } = require('express-validator');
const { ifNotFound, isLoggedIn, finishValidation } = require('./utils');
const Post = require('../models/post');

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
    post: [
      isLoggedIn,
      body('title')
        .trim()
        .escape()
        .isLength({ min: 5, max: 150 })
        .withMessage(
          'Must be at least 5 characters and no more than 150 characters'
        ),
      body('summary')
        .optional()
        .trim()
        .escape()
        .isLength({ max: 300 })
        .withMessage('Must be no more than 300 characters'),
      body('body').trim(),
      body('published').optional({ checkFalsy: true }).toBoolean(),
      finishValidation()
        .ifSuccess(async (req, res) => {
          const post = new Post({
            author: req.user.username,
            title: req.body.title,
            summary: req.body.summary ?? '',
            body: req.body.body,
            tags: req.body.tags ?? [],
            published: req.body.published ?? true,
          });

          await post.save();

          res.json({
            message: 'Post created',
            post: post.toSafeObject(),
          });
        })
        .ifHasError((errors, req, res) => {
          res.status(400).json({ errors });
        }),
    ],
    put: [
      isLoggedIn,
      param('postid').escape(),
      body('title')
        .trim()
        .escape()
        .isLength({ min: 5, max: 150 })
        .withMessage(
          'Must be at least 5 characters and no more than 150 characters'
        ),
      body('summary')
        .optional()
        .trim()
        .escape()
        .isLength({ max: 300 })
        .withMessage('Must be no more than 300 characters'),
      body('body').trim(),
      body('published').optional({ checkFalsy: true }).toBoolean(),
      finishValidation()
        .ifSuccess(async (req, res) => {
          try {
            const post = await Post.findByShortId(req.params.postid);

            Object.assign(post, {
              title: req.body.title,
              summary: req.body.summary ?? '',
              body: req.body.body,
              tags: req.body.tags ?? [],
              published: req.body.published ?? post.published,
            });

            await post.save();

            res.json({
              message: 'Post updated',
              post: post.toSafeObject(),
            });
          } catch (error) {
            res.status(400).json({ errors: error });
          }
        })
        .ifHasError((errors, req, res) => {
          res.status(400).json({ errors });
        }),
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
