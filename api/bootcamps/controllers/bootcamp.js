const ErrorResponse = require('../../../untils/errorResponse');
const asyncHandler = require('../../../middleware/async');
const Bootcamp = require('../models/bootcamp');

const path = require('path');
// @desc  get all bootcamps
// @route  GET  /bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

  res.status(200).json(res.advancedResults);
});

// @desc  get single bootcamp
// @route  GET  /bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`), 404);

  }
  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

// @desc  create new bootcamp
// @route  POST  /bootcamps
// @access  private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
// add user to req, body
req.body.user = req.user.id;
// console.log(req)
  // check for published bootcamp

      const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
    
      // if user not admin , can only add one bootcamp
      if (publishedBootcamp && req.user.role !== 'admin') {
        return next( new ErrorResponse(`${req.user.name} has already published an bootcamp before`, 400 ) )
      }

  const bootcamp = await Bootcamp.create(req.body);



  res.status(201).json({
    success: true,
    data: bootcamp
  });

  });


// @desc  update single bootcamp
// @route  PUT  /bootcamps/:id
// @access  private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`), 404);

  }
  // make sure user is bootcamp owner
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== "admin" ) {
    return  next(new ErrorResponse(`${req.user.name} is not authorized to update this bootcamp`), 401);

  }

   bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

// @desc  delete single bootcamp
// @route  DELETE  /bootcamps/:id
// @access  private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`), 404);

  }
  // make sure user is bootcamp owner
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== "admin" ) {
    return  next(new ErrorResponse(`${req.user.name} is not authorized to DELETE this bootcamp`), 401);

  }
  bootcamp.remove(); // to run remove all courses middelware

  res.status(200).json({
    success: true,
    data: {}
  });

});


// @desc  upload photo  bootcamp
// @route  PUT photo  /bootcamps/:id/photo
// @access  private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);


  if (!bootcamp) {
    return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`), 404);

  };

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No files were uploaded.'
  });
  }
    
  // make sure is it a photo
const file = req.files.file;

  if(!file.mimetype.startsWith('image')) {
    return res.status(400).json({
      success: false,
      error: 'please uploaded valid image.'
  });
  }

  // check photo size
  if(file.size > process.env.MAX_FILE_SIZE) {
    return res.status(400).json({
      success: false,
      error:   `Image Must be less than ${process.env.MAX_FILE_SIZE}`
  });
  }

  file.name = `bootcamp_photo_${bootcamp._id}${path.parse(file.name).ext}`;
  
  // upload photo
  file.mv(`${process.env.FILE_UPLOAD_PATH}/bootcamps/${file.name}`, async err => {
    if(err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        error: 'proplem during upload'
    });
  }

    await Bootcamp.findOneAndUpdate(req.params.id , {
      photo: file.name
    });
    res.status(200).json({
      success: true,
      error: file.name
  });
  })
  
  


});
