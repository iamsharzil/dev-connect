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
  .route('/:id')
  .get(postController.getPostById)
  .delete(postController.deletePost);

router.put('/like/:id', postController.likePost);
router.put('/unlike/:id', postController.unlikePost);

router.post('/comment/:id', postController.addComment);
router.delete('/comment/:id/:comment_id', postController.deleteComment);

module.exports = router;
