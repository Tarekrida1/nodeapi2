const express = require("express");
const {
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  createCourse
 
} = require("../controllers/course");
const { protect , authorize } = require('../../../middleware/auth');



const router = express.Router({ mergeParams: true });
const advancedResults = require('../../../middleware/advancedResults');
const Course = require('../models/Course');
router.route('/').get(advancedResults(Course,{
  path: 'bootcamp',
  select: 'name description'
}) ,getCourses).post(protect,authorize('publisher', 'admin'), createCourse);
router.route('/:bootcampId').get(advancedResults(Course,{
  path: 'bootcamp',
  select: 'name description'
}) ,getCourses);
router.route('/:id').get(getCourse).put(protect,authorize('publisher', 'admin'),authorize('publisher', 'admin'), updateCourse).delete(protect, deleteCourse);

// 
// router.route('/').get(getBootcamps).post(createBootcamp);
// router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;
