import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const WorkoutContext = createContext();

// Sample initial workouts for preview if offline/no data yet
const INITIAL_DEMO_WORKOUTS = [
  {
    _id: 'w1',
    exerciseName: 'Bench Press',
    workoutType: 'Strength',
    sets: 4,
    reps: 10,
    weight: 80,
    duration: 45,
    workoutDate: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
    notes: 'Pushed heavy weight today. Great pump in chest and triceps.',
  },
  {
    _id: 'w2',
    exerciseName: 'Treadmill Interval Run',
    workoutType: 'Cardio',
    sets: 1,
    reps: 1,
    weight: 0,
    duration: 30,
    workoutDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    notes: 'HIIT intervals: 1 min sprint, 1 min jog. High energy!',
  },
  {
    _id: 'w3',
    exerciseName: 'Barbell Squats',
    workoutType: 'Strength',
    sets: 5,
    reps: 8,
    weight: 100,
    duration: 50,
    workoutDate: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
    notes: 'Deep form on squats. Leg day crushed.',
  },
  {
    _id: 'w4',
    exerciseName: 'Full Body HIIT Circuit',
    workoutType: 'HIIT',
    sets: 3,
    reps: 15,
    weight: 15,
    duration: 35,
    workoutDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    notes: 'Kettlebell swings, burpees, mountain climbers. Burned maximum calories.',
  },
  {
    _id: 'w5',
    exerciseName: 'Dynamic Vinyasa Flow',
    workoutType: 'Flexibility',
    sets: 1,
    reps: 1,
    weight: 0,
    duration: 40,
    workoutDate: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
    notes: 'Hamstring and shoulder flexibility routine. Felt relaxed.',
  },
];

export const WorkoutProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem('fitness_workouts_log');
    return saved ? JSON.parse(saved) : INITIAL_DEMO_WORKOUTS;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync state to local storage for offline continuity
  useEffect(() => {
    localStorage.setItem('fitness_workouts_log', JSON.stringify(workouts));
  }, [workouts]);

  // Fetch Workouts from Express Backend via REST API
  const fetchWorkouts = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/workouts');
      if (Array.isArray(response.data)) {
        setWorkouts(response.data);
      } else if (response.data && Array.isArray(response.data.workouts)) {
        setWorkouts(response.data.workouts);
      }
    } catch (err) {
      console.warn('Could not fetch from REST API, using existing state:', err.message);
      setError(err.response?.data?.message || null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let ignore = false;
    if (isAuthenticated) {
      api.get('/workouts')
        .then((response) => {
          if (ignore) return;
          if (Array.isArray(response.data)) {
            setWorkouts(response.data);
          } else if (response.data && Array.isArray(response.data.workouts)) {
            setWorkouts(response.data.workouts);
          }
        })
        .catch((err) => {
          if (ignore) return;
          console.warn('Could not fetch from REST API, using existing state:', err.message);
          setError(err.response?.data?.message || null);
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    }
    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  // Add Workout
  const addWorkout = async (newWorkoutData) => {
    setLoading(true);
    try {
      const response = await api.post('/workouts', newWorkoutData);
      const createdWorkout = response.data.workout || response.data;
      setWorkouts((prev) => [createdWorkout, ...prev]);
      return { success: true, workout: createdWorkout };
    } catch (err) {
      console.error('API POST /api/workouts failed:', err.message);
      return {
        success: false,
        error: err.response?.data?.message || 'Could not save workout to the database.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Update Workout
  const updateWorkout = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await api.put(`/workouts/${id}`, updatedData);
      const updatedWorkout = response.data.workout || response.data;
      setWorkouts((prev) =>
        prev.map((item) => (item._id === id || item.id === id ? { ...item, ...updatedWorkout } : item))
      );
      return { success: true, workout: updatedWorkout };
    } catch (err) {
      console.error(`API PUT /api/workouts/${id} failed:`, err.message);
      return {
        success: false,
        error: err.response?.data?.message || 'Could not update workout in the database.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Delete Workout
  const deleteWorkout = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/workouts/${id}`);
      setWorkouts((prev) => prev.filter((item) => item._id !== id && item.id !== id));
      return { success: true };
    } catch (err) {
      console.error(`API DELETE /api/workouts/${id} failed:`, err.message);
      return {
        success: false,
        error: err.response?.data?.message || 'Could not delete workout from the database.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Dashboard Stats Calculations
  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
  const totalExercises = new Set(workouts.map((w) => w.exerciseName?.trim().toLowerCase())).size;

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        loading,
        error,
        fetchWorkouts,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        totalWorkouts,
        totalDuration,
        totalExercises,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWorkouts = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkouts must be used within a WorkoutProvider');
  }
  return context;
};
