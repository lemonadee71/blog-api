const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');

router.get('/t/:tag', postController.all.get.byTag);

module.exports = router;
