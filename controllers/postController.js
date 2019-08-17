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
  const post = await Post.findById(req.params.post_id);

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
