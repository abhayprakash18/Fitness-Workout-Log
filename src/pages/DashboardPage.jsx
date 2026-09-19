import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWorkouts } from '../context/WorkoutContext';
import { Dumbbell, Clock, Activity, PlusCircle, ArrowRight, Calendar, Flame, Award, Hash, History } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const { workouts, totalWorkouts, totalDuration, totalExercises, loading } = useWorkouts();

  // Get recent 4 workouts
  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.workoutDate || b.createdAt) - new Date(a.workoutDate || a.createdAt))
    .slice(0, 5);

  const getCategoryBadgeClass = (type) => {
    switch (type) {
      case 'Strength':
        return 'badge-category badge-strength';
      case 'Cardio':
        return 'badge-category badge-cardio';
      case 'HIIT':
        return 'badge-category badge-hiit';
      case 'Flexibility':
        return 'badge-category badge-flexibility';
      default:
        return 'badge-category badge-other';
    }
  };

  return (
    <div className="dashboard-container space-y-6">
      {/* Welcome Banner Header */}
      <div className="dashboard-welcome-banner">
        <div className="welcome-text-group">
          <h1 className="welcome-title">
            Welcome back, <span className="text-gradient">{user?.name || 'Athlete'}</span> 👋
          </h1>
          <p className="welcome-subtitle">
            Here is your fitness overview. You have logged <strong>{totalWorkouts}</strong> workout sessions!
          </p>
        </div>
        <div className="welcome-action">
          <Link to="/add-workout" className="btn btn-primary btn-md">
            <PlusCircle size={20} />
            <span>Add Workout</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Workouts</span>
            <div className="stat-icon-wrapper icon-emerald">
              <Dumbbell size={22} />
            </div>
          </div>
          <div className="stat-value">{totalWorkouts}</div>
          <p className="stat-footer-text text-emerald">
            <Flame size={14} /> Completed sessions
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Duration</span>
            <div className="stat-icon-wrapper icon-violet">
              <Clock size={22} />
            </div>
          </div>
          <div className="stat-value">{totalDuration} <span className="stat-unit">mins</span></div>
          <p className="stat-footer-text text-violet">
            ~{(totalDuration / 60).toFixed(1)} total training hours
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Exercises</span>
            <div className="stat-icon-wrapper icon-cyan">
              <Activity size={22} />
            </div>
          </div>
          <div className="stat-value">{totalExercises}</div>
          <p className="stat-footer-text text-cyan">
            Unique movements logged
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Est. Calories Burned</span>
            <div className="stat-icon-wrapper icon-amber">
              <Flame size={22} />
            </div>
          </div>
          <div className="stat-value">{Math.round(totalDuration * 7.5)} <span className="stat-unit">kcal</span></div>
          <p className="stat-footer-text text-amber">
            Based on active training time
          </p>
        </div>
      </div>

      {/* Dashboard Main Content Grid */}
      <div className="dashboard-content-grid">
        {/* Recent Workouts List */}
        <div className="card-panel">
          <div className="panel-header">
            <div className="flex-align-center gap-2">
              <History size={20} className="brand-accent" />
              <h2 className="panel-title">Recent Workouts</h2>
            </div>
            <Link to="/history" className="link-primary text-sm flex-align-center gap-1">
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="flex-center py-8">
              <div className="spinner"></div>
            </div>
          ) : recentWorkouts.length === 0 ? (
            <div className="empty-state">
              <Dumbbell size={40} className="text-muted" />
              <h3>No Workouts Logged Yet</h3>
              <p className="text-muted text-sm">Start your fitness journey by recording your first exercise session.</p>
              <Link to="/add-workout" className="btn btn-primary margin-top-sm">
                Log Your First Workout
              </Link>
            </div>
          ) : (
            <div className="recent-workouts-list">
              {recentWorkouts.map((workout) => (
                <div key={workout._id || workout.id} className="recent-workout-item">
                  <div className="recent-workout-left">
                    <span className={getCategoryBadgeClass(workout.workoutType)}>
                      {workout.workoutType}
                    </span>
                    <div className="workout-info">
                      <h4 className="exercise-title">{workout.exerciseName}</h4>
                      <div className="workout-subtext">
                        <span className="flex-align-center gap-1">
                          <Calendar size={14} />
                          {new Date(workout.workoutDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex-align-center gap-1">
                          <Clock size={14} />
                          {workout.duration} mins
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="recent-workout-right text-right">
                    {workout.workoutType === 'Strength' && (
                      <div className="workout-stat-highlight">
                        <strong>{workout.sets}</strong> sets × <strong>{workout.reps}</strong> reps
                        {workout.weight > 0 && <span className="text-muted"> @ {workout.weight}kg</span>}
                      </div>
                    )}
                    {workout.workoutType !== 'Strength' && (
                      <div className="workout-stat-highlight">
                        Duration: <strong>{workout.duration}m</strong>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Workout Tips & Stats Sidebar */}
        <div className="card-panel">
          <div className="panel-header">
            <div className="flex-align-center gap-2">
              <Award size={20} className="brand-accent" />
              <h2 className="panel-title">Training Focus</h2>
            </div>
          </div>

          <div className="training-focus-body space-y-4">
            <div className="focus-card">
              <h4 className="focus-card-title flex-align-center gap-2">
                <Flame size={18} className="text-amber" />
                Consistency Streak
              </h4>
              <p className="text-sm text-muted">
                Log at least 3 workouts a week to keep your momentum going and maximize strength gains.
              </p>
            </div>

            <div className="focus-card">
              <h4 className="focus-card-title flex-align-center gap-2">
                <Dumbbell size={18} className="text-emerald" />
                Progressive Overload
              </h4>
              <p className="text-sm text-muted">
                Gradually increase the weight or rep count on key exercises to stimulate muscle hypertrophy.
              </p>
            </div>

            <div className="quick-action-cta">
              <p className="text-sm font-semibold mb-2">Ready for your next session?</p>
              <Link to="/add-workout" className="btn btn-outline btn-block">
                <PlusCircle size={16} />
                <span>Log New Session</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
