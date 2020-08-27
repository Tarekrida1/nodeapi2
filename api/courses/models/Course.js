const mongoose = require("mongoose");
const CourseSchema = new mongoose.Schema({
title: {
    type: String,
    required: [true, 'please add a title'],
    trim: true,
},
description: {
    type: String,
    required: [true, 'please add a description'],
},
weeks: {
  type: String,
  required: [true, 'please add number of weeks'],
},

  tuition: {
    type: Number,
    required: [true, 'please add tuition cost']
  },

  minimumSkill: {
    type: String,
    required: [true, 'please add minimumSkill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarhipsAvailableZ: {
    type: Boolean,
    default: false

  },
  createdAt: {
    type: Date,
    default: Date.now
  },
user: {
  type: mongoose.Schema.ObjectId,
  ref: 'User',
  required: true
}
});





module.exports = mongoose.model('Course', CourseSchema);