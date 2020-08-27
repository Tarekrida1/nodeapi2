const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampPhotoUpload
} = require("../controllers/bootcamp.js");
const advancedResults = require('../../../middleware/advancedResults');
const Bootcamp = require('../models/bootcamp');
const courseRouter = require('../../courses/routes/course');


const router = express.Router();
const { protect, authorize } = require('../../../middleware/auth');


router.use('/:bootcampId/courses' ,courseRouter);
router.route('/:id/photo').put(protect,authorize('publisher', 'admin'), bootcampPhotoUpload);
router.route('/').get(advancedResults(Bootcamp, 'courses'),getBootcamps).post(protect,authorize('publisher', 'admin'), createBootcamp);
router.route('/:id').get(getBootcamp).put(protect,authorize('publisher', 'admin'), updateBootcamp).delete(protect,authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
