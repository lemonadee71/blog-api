const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');
const postController = require('../controllers/post');

router.get('/t/:tag', postController.all.get.byTag);
router.get('/user', controller.isAuthenticated);
router.post('/login', controller.login);
router.post('/logout', controller.logout);

module.exports = router;
