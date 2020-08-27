const ErrorResponse = require('../../../untils/errorResponse');
const asyncHandler = require('../../../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../../bootcamps/models/bootcamp');


// @desc  get all Courses
// @route  GET  /Courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if(req.params.bootcampId) {
const courses = await Course.find({ bootcamp: req.params.bootcampId});
return res.status(200).json({
  success: true, 
  count: courses.length,
  data: courses
});

  } else {
    res.status(200).json(res.advancedResults);

  }
 


});



// @desc  get single Course
// @route  GET  /Course/1
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  })

  if(!course) {
    return next(new ErrorResponse('No course with id ' + req.params.id), 404);
  }
  res.status(200).json({
    success: true,
    data: course
  })
});



// @desc  add single Course
// @route  POST  /bootcamps/:bootcampId/courses
// @access  private
exports.createCourse = asyncHandler(async (req, res, next) => {

  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
 
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if(!bootcamp) {
    return next(new ErrorResponse('No bootcamp with id ' + req.params.bootcampId), 404);
  }

       // make sure user is bootcamp owner
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== "admin" ) {
    return  next(new ErrorResponse(`${req.user.name} is not authorized to add a course to this bootcamp ${bootcamp._id}`), 401);

  }


  const course = await Course.create(req.body)
  res.status(200).json({
    success: true,
    data: course
  })
});

// @desc  update Course
// @route  PUT  /courses/:id
// @access  private
exports.updateCourse = asyncHandler(async (req, res, next) => {
   
    let course = await Course.findById(req.params.id);
  
    if(!course) {
      return next(new ErrorResponse('No course with id ' + req.params.id), 404);
    }
  
         // make sure user is course owner
  if(course.user.toString() !== req.user.id && req.user.role !== "admin" ) {
    return  next(new ErrorResponse(`${req.user.name} is not authorized to update this course  ${course._id}`), 401);

  }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: course
    })
  });
  

  

// @desc  update Course
// @route  PUT  /courses/:id
// @access  private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
   
  const course = await Course.findById(req.params.id);

  if(!course) {
    return next(new ErrorResponse('No course with id ' + req.params.id), 404);
  }

    
         // make sure user is course owner
         if(course.user.toString() !== req.user.id && req.user.role !== "admin" ) {
          return  next(new ErrorResponse(`${req.user.name} is not authorized to Delete this course  ${course._id}`), 401);
      
        }

        
 await course.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  })
});
