const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    exerciseName: {
      type: String,
      required: [true, 'Please add an exercise name'],
      trim: true,
    },
    workoutType: {
      type: String,
      required: [true, 'Please select a workout type'],
      enum: {
        values: ['Strength', 'Cardio', 'Flexibility', 'HIIT', 'Other'],
        message: '{VALUE} is not a valid workout type',
      },
    },
    sets: {
      type: Number,
      default: 1,
      min: [1, 'Sets must be at least 1'],
    },
    reps: {
      type: Number,
      default: 1,
      min: [1, 'Reps must be at least 1'],
    },
    weight: {
      type: Number,
      default: 0,
      min: [0, 'Weight cannot be negative'],
    },
    duration: {
      type: Number,
      required: [true, 'Please specify duration in minutes'],
      min: [0, 'Duration cannot be negative'],
    },
    date: {
      type: Date,
      required: [true, 'Please specify workout date'],
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for workoutDate string format (YYYY-MM-DD) for seamless frontend integration
workoutSchema.virtual('workoutDate').get(function () {
  return this.date ? this.date.toISOString().split('T')[0] : null;
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
