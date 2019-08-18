const request = require('request');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const User = require('../models/userModel');
const Profile = require('../models/profileModel');

exports.createProfile = catchAsync(async (req, res, next) => {
  req.body.skills = req.body.skills.split(',').map(skill => skill.trim());
  req.body.social = {};

  const socialProfiles = [
    'youtube',
    'facebook',
    'twitter',
    'linkedin',
    'instagram'
  ];

  socialProfiles.forEach(profile => {
    if (req.body[profile]) {
      req.body.social[profile] = req.body[profile];
      delete req.body[profile];
    }
  });

  const profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { $set: req.body },
    { new: true, upsert: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      profile
    }
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id }).populate(
    'user',
    ['name', 'avatar']
  );

  if (!profile)
    return next(new AppError('There is no profile for this user', 400));

  res.status(200).json({
    status: 'success',
    data: { profile }
  });
});

exports.getAllProfiles = catchAsync(async (req, res, next) => {
  const profiles = await Profile.find().populate('user', ['name', 'avatar']);
  res.status(200).json({
    status: 'success',
    results: profiles.length,
    data: {
      profiles
    }
  });
});

exports.getProfileById = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.params.user_id }).populate(
    'user',
    ['name', 'avatar']
  );

  if (!profile)
    return next(new AppError('There is no profile for the user', 400));

  res.status(200).json({
    status: 'success',
    data: { profile }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  // 1) Delete user posts
  // await Post.deleteMany({ user: req.user.id });

  // 2) Delete profile
  await Profile.findOneAndRemove({ user: req.user.id });

  // 3) Remove user
  await User.findOneAndRemove({ _id: req.user.id });

  res.status(200).json({
    status: 'success',
    message: 'User Deleted'
  });
});

exports.addExperience = catchAsync(async (req, res, next) => {
  const { title, company, location, from, to, current, description } = req.body;

  if (!title || !company || !from)
    return next(new AppError('Please fill the required fields'));

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  };

  const profile = await Profile.findOne({ user: req.user.id });

  profile.experience.push(newExp);

  await profile.save();

  res.status(200).json({
    status: 'success',
    data: {
      profile
    }
  });
});

exports.deleteExperience = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id });

  const removeIndex = profile.experience
    .map(exp => exp.id)
    .indexOf(req.params.exp_id);

  if (removeIndex === -1) {
    return next(new AppError('No Experience found with that ID'));
  }

  profile.experience.splice(removeIndex, 1);

  await profile.save();

  res.status(200).json({
    status: 'success',
    data: {
      profile
    }
  });
});

exports.addEducation = catchAsync(async (req, res, next) => {
  const {
    school,
    degree,
    fieldOfStudy,
    from,
    to,
    current,
    description
  } = req.body;

  if (!school || !degree || !fieldOfStudy || !from)
    return next(new AppError('Please fill the required fields', 400));

  const newEdu = {
    school,
    degree,
    fieldOfStudy,
    from,
    to,
    current,
    description
  };

  const profile = await Profile.findOne({ user: req.user.id });

  profile.education.push(newEdu);

  await profile.save();

  res.status(200).json({
    status: 'success',
    data: {
      profile
    }
  });
});

exports.deleteEducation = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id });

  const removeIndex = profile.education
    .map(ed => ed.id)
    .indexOf(req.params.edu_id);

  if (removeIndex === -1) {
    return next(new AppError('No Experience found with that ID'));
  }

  profile.education.splice(removeIndex, 1);

  await profile.save();

  res.status(200).json({
    status: 'success',
    data: {
      profile
    }
  });
});

exports.getUserRepos = catchAsync(async (req, res, next) => {
  const options = {
    uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`,
    method: 'GET',
    headers: { 'user-agent': 'node.js' }
  };

  request(options, (error, response, body) => {
    if (error) console.error(error);

    if (response.statusCode !== 200)
      return next(new AppError('No Github Profile found', 404));

    res.status(200).json({
      status: 'success',
      data: {
        body: JSON.parse(body)
      }
    });
  });
});
