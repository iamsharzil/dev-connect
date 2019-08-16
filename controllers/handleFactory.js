const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOne = Model =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    const doc = await query;

    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
