const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const postController = require('../controllers/post');
const commentController = require('../controllers/comment');

router.get('/', userController.all.get);
// Use same controller if possible but add preprocessing of token to identify author
// router.get('/self', userController.index.get)
router.get('/:username', userController.index.get);
router.get('/:username/posts', postController.all.get.byAuthor);
router.get('/:username/comments', commentController.get.byAuthor);

module.exports = router;
