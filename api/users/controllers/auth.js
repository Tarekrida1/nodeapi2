const ErrorResponse = require('../../../untils/errorResponse');
const asyncHandler = require('../../../middleware/async');
const User = require('../models/User');
const Bootcamp = require('../../bootcamps/models/bootcamp');
const { use } = require('../routes/auth');


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



// @desc  Register User
// @route  POST  /auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
const { name, email, password, role } =  req.body;
// getSignedJwtToken
// create user
const user = await User.create({
  name, 
  email, 
  password, 
  role
});

sendTokenRes(user, 200, res);

});

// @desc  update Course
// @route  PUT  /courses/:id
// @access  private
exports.updateCourse = asyncHandler(async (req, res, next) => {
   
    let course = await Course.findById(req.params.id);
  
    if(!course) {
      return next(new ErrorResponse('No course with id ' + req.params.id), 404);
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
  


  
// @desc  get current user
// @route  POST  /auth/profile
// @access  private
exports.currentUser = asyncHandler(async (req, res, next) => {

 // check the user
  const user = await User.findById(req.user.id);

if(!user) {
  return next(new ErrorResponse('invalid credentials', 401))
}
res.status(200).json({
  success: true,
  data: user
})



  });
  




// @desc  Login User
// @route  POST  /auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const {email, password } =  req.body;
 // validate email & password
 if(!email || !password) {
   return next(new ErrorResponse('please add email and password', 404))
 }
 // check the user
  const user = await User.findOne({ email }).select('password');
if(!user) {
  return next(new ErrorResponse('invalid credentials', 401))
}

//  check if password matched

const isMatch = await user.checkMatchedPassword(password);

if(!isMatch) {
  return next(new ErrorResponse('invalid credentials', 401))
}

sendTokenRes(user, 200, res);

  });
  

// @desc  update Course
// @route  PUT  /courses/:id
// @access  private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
   
  const course = await Course.findById(req.params.id);

  if(!course) {
    return next(new ErrorResponse('No course with id ' + req.params.id), 404);
  }

 await course.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  })
});


// get token from model, create cookie and send res

const sendTokenRes = (user, statusCode, res) => {
  // create token 
const token = user.getSignedJwtToken();
// JWT_COOKIE_EXPIRE
const options = {
expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 1000),
httpOnly: true
}
if(process.env.NODE_DEV === 'production') {
  options.secure = true;
}
res.status(statusCode)
.cookie('token', token, options)
.json({
  success: true,
  token
})
} 