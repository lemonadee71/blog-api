const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const commentController = require('../controllers/comment');

router.get('/', postController.all.get._);
router.post('/', postController.index.post);
// Use same controller if possible but add preprocessing of token to identify author
// router.get('/posts/self', postController.all.get.byAuthor)
// Might consider /:username/:postid
router.get('/:postid', postController.index.get);
router.put('/:postid', postController.index.put);
router.get('/:postid/comments', commentController.get.byPost);

module.exports = router;
