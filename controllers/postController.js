const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const User = require('../models/userModel');
const Post = require('../models/postModel');

exports.createPost = catchAsync(async (req, res, next) => {
  if (!req.body.text) {
    return next(new AppError('Text is required', 400));
  }

  const user = await User.findById(req.user.id);

  const newPost = new Post({
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id
  });

  const post = await newPost.save();

  res.status(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find().sort({ date: -1 });

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: { posts }
  });
});

exports.getPostById = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) return next(new AppError('No post found with that ID', 400));

  res.status(200).json({
    status: 'success',
    data: { post }
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.post_id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  if (post.user.toString() !== req.user.id) {
    return next(new AppError('User not authorized', 401));
  }

  await post.remove();

  res.status(200).json({
    status: 'success',
    message: 'Post Deleted'
  });
});

exports.likePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) return next(new AppError('No post found with that ID', 400));

  if (
    post.likes.filter(like => like.user.toString() === req.user.id).length > 0
  ) {
    return next(new AppError('Post already liked', 400));
  }

  post.likes.unshift({ user: req.user.id });

  await post.save();

  res.status(200).json({
    status: 'success',
    data: { post }
  });
});

exports.unlikePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) return next(new AppError('No post found with that ID', 400));

  if (
    post.likes.filter(like => like.user.toString() === req.user.id).length === 0
  ) {
    return next(new AppError('Post has not yet been liked', 400));
  }

  const removeIndex = post.likes
    .map(like => like.user.toString())
    .indexOf(req.user.id);

  post.likes.splice(removeIndex, 1);

  await post.save();

  res.status(200).json({
    status: 'success',
    data: { post }
  });
});

exports.addComment = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const post = await Post.findById(req.params.id);

  if (!user) return next(new AppError('No user found with that ID', 400));

  if (!post) return next(new AppError('No post found with that ID', 400));

  const newComment = {
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id
  };

  post.comments.unshift(newComment);

  await post.save();

  res.status(200).json({
    status: 'success',
    data: { post }
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) return next(new AppError('No post found with that ID', 400));

  const comment = post.comments.find(
    comment => comment.id === req.params.comment_id
  );

  if (!comment) return next(new AppError('No comment found with that ID', 400));

  if (comment.user.toString() !== req.user.id) {
    return next(new AppError('User not authorized', 400));
  }

  const removeIndex = post.comments
    .map(comment => comment.id)
    .indexOf(req.params.comment_id);

  post.comments.splice(removeIndex, 1);

  await post.save();

  res.status(200).json({
    status: 'success',
    data: { post }
  });
});
