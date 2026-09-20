const mongoose = require('mongoose');
const Workout = require('../models/Workout');

/**
 * @desc    Create a new workout
 * @route   POST /api/workouts
 * @access  Private
 */
const createWorkout = async (req, res, next) => {
  try {
    const {
      exerciseName,
      workoutType,
      sets,
      reps,
      weight,
      duration,
      date,
      workoutDate,
      notes,
    } = req.body;

    if (!exerciseName || !workoutType || duration === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide exerciseName, workoutType, and duration',
      });
    }

    // Determine target date from payload (prefer explicitly passed date or workoutDate)
    const targetDate = date || workoutDate || new Date();

    const workout = await Workout.create({
      user: req.user._id,
      exerciseName: exerciseName.trim(),
      workoutType,
      sets: sets !== undefined ? Number(sets) : 1,
      reps: reps !== undefined ? Number(reps) : 1,
      weight: weight !== undefined ? Number(weight) : 0,
      duration: Number(duration),
      date: targetDate,
      notes: notes ? notes.trim() : '',
    });

    return res.status(201).json({
      success: true,
      message: 'Workout created successfully',
      workout,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all workouts for logged-in user
 * @route   GET /api/workouts
 * @access  Private
 */
const getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({
      date: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: workouts.length,
      workouts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single workout by ID
 * @route   GET /api/workouts/:id
 * @access  Private
 */
const getWorkoutById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID format',
      });
    }

    const workout = await Workout.findById(id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found',
      });
    }

    // Verify ownership
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this workout',
      });
    }

    return res.status(200).json({
      success: true,
      workout,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update workout by ID
 * @route   PUT /api/workouts/:id
 * @access  Private
 */
const updateWorkout = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID format',
      });
    }

    let workout = await Workout.findById(id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found',
      });
    }

    // Verify ownership
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this workout',
      });
    }

    const {
      exerciseName,
      workoutType,
      sets,
      reps,
      weight,
      duration,
      date,
      workoutDate,
      notes,
    } = req.body;

    // Build update fields object, strictly ignoring 'user'
    const fieldsToUpdate = {};

    if (exerciseName !== undefined) fieldsToUpdate.exerciseName = exerciseName.trim();
    if (workoutType !== undefined) fieldsToUpdate.workoutType = workoutType;
    if (sets !== undefined) fieldsToUpdate.sets = Number(sets);
    if (reps !== undefined) fieldsToUpdate.reps = Number(reps);
    if (weight !== undefined) fieldsToUpdate.weight = Number(weight);
    if (duration !== undefined) fieldsToUpdate.duration = Number(duration);
    if (date !== undefined || workoutDate !== undefined) {
      fieldsToUpdate.date = date || workoutDate;
    }
    if (notes !== undefined) fieldsToUpdate.notes = notes.trim();

    const updatedWorkout = await Workout.findByIdAndUpdate(
      id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Workout updated successfully',
      workout: updatedWorkout,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete workout by ID
 * @route   DELETE /api/workouts/:id
 * @access  Private
 */
const deleteWorkout = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID format',
      });
    }

    const workout = await Workout.findById(id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found',
      });
    }

    // Verify ownership
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this workout',
      });
    }

    await workout.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Workout deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get workout statistics for dashboard
 * @route   GET /api/workouts/stats
 * @access  Private
 */
const getWorkoutStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all workouts for user
    const workouts = await Workout.find({ user: userId }).sort({ date: -1 });

    const totalWorkouts = workouts.length;

    // Calculate total duration in minutes
    const totalDuration = workouts.reduce(
      (sum, item) => sum + (Number(item.duration) || 0),
      0
    );

    // Unique exercise names
    const uniqueExercisesSet = new Set(
      workouts
        .map((w) => (w.exerciseName ? w.exerciseName.trim().toLowerCase() : ''))
        .filter(Boolean)
    );
    const totalExercises = uniqueExercisesSet.size;

    // Recent 5 workouts
    const recentWorkouts = workouts.slice(0, 5);

    // Count breakdown by workoutType
    const workoutTypes = {
      Strength: 0,
      Cardio: 0,
      Flexibility: 0,
      HIIT: 0,
      Other: 0,
    };

    workouts.forEach((w) => {
      if (workoutTypes[w.workoutType] !== undefined) {
        workoutTypes[w.workoutType] += 1;
      } else {
        workoutTypes.Other += 1;
      }
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalWorkouts,
        totalDuration,
        totalExercises,
        recentWorkouts,
        workoutTypes,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats,
};
