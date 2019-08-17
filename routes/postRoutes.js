const express = require('express');

const authController = require('../controllers/authController');
const postController = require('../controllers/postController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(postController.getAllPosts)
  .post(postController.createPost);

router
  .route('/:post_id')
  .get(postController.getPostById)
  .delete(postController.deletePost);

module.exports = router;
