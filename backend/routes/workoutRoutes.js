const express = require('express');
const router = express.Router();
const {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats,
} = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

// Apply JWT authentication middleware to all workout routes
router.use(protect);

// Dashboard Statistics Route (defined before /:id to prevent route shadowing)
router.get('/stats', getWorkoutStats);

// Base /api/workouts routes
router.route('/')
  .get(getWorkouts)
  .post(createWorkout);

// ID specific routes /api/workouts/:id
router.route('/:id')
  .get(getWorkoutById)
  .put(updateWorkout)
  .delete(deleteWorkout);

module.exports = router;
