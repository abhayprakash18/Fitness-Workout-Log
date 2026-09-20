import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkouts } from '../context/WorkoutContext';
import EditWorkoutModal from '../components/EditWorkoutModal';
import {
  History,
  Search,
  Filter,
  PlusCircle,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Dumbbell,
  AlertTriangle,
} from 'lucide-react';

const WorkoutHistoryPage = ({ showToast }) => {
  const { workouts, loading, updateWorkout, deleteWorkout } = useWorkouts();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Edit Modal State
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Delete Confirmation State
  const [deletingWorkoutId, setDeletingWorkoutId] = useState(null);

  // Filtering & Sorting Logic
  const filteredWorkouts = workouts
    .filter((w) => {
      const matchesSearch = w.exerciseName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'All' || w.workoutType === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.workoutDate || b.createdAt) - new Date(a.workoutDate || a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.workoutDate || a.createdAt) - new Date(b.workoutDate || b.createdAt);
      } else if (sortBy === 'duration-desc') {
        return Number(b.duration) - Number(a.duration);
      } else if (sortBy === 'duration-asc') {
        return Number(a.duration) - Number(b.duration);
      }
      return 0;
    });

  const handleEditClick = (workout) => {
    setEditingWorkout(workout);
    setIsEditModalOpen(true);
  };

  const handleSaveUpdate = async (id, updatedData) => {
    const res = await updateWorkout(id, updatedData);
    if (res.success) {
      showToast('Workout updated successfully!', 'success');
    } else {
      showToast('Failed to update workout.', 'error');
    }
  };

  const handleDeleteConfirm = async (id) => {
    const res = await deleteWorkout(id);
    if (res.success) {
      showToast('Workout deleted from log.', 'info');
      setDeletingWorkoutId(null);
    } else {
      showToast('Failed to delete workout.', 'error');
    }
  };

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
    <div className="history-page-container space-y-6">
      {/* Page Header */}
      <div className="history-page-header flex-between flex-wrap gap-4">
        <div>
          <h1 className="page-title flex-align-center gap-2">
            <History className="brand-accent" size={28} />
            Workout History Log
          </h1>
          <p className="page-subtitle">View, search, edit, and delete your recorded exercise sessions.</p>
        </div>

        <Link to="/add-workout" className="btn btn-primary btn-md">
          <PlusCircle size={18} />
          <span>Add Workout</span>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="filter-toolbar card-panel">
        <div className="filter-grid">
          {/* Search Box */}
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by exercise name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input search-input"
            />
          </div>

          {/* Category Filter */}
          <div className="filter-select-group">
            <Filter size={16} className="text-muted" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="form-select filter-select"
            >
              <option value="All">All Categories</option>
              <option value="Strength">Strength</option>
              <option value="Cardio">Cardio</option>
              <option value="Flexibility">Flexibility</option>
              <option value="HIIT">HIIT</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="filter-select-group">
            <span className="text-muted text-xs font-semibold">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select filter-select"
            >
              <option value="newest">Date (Newest First)</option>
              <option value="oldest">Date (Oldest First)</option>
              <option value="duration-desc">Duration (High to Low)</option>
              <option value="duration-asc">Duration (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workouts History List / Cards */}
      {loading ? (
        <div className="flex-center py-12">
          <div className="spinner"></div>
        </div>
      ) : filteredWorkouts.length === 0 ? (
        <div className="card-panel empty-state">
          <Dumbbell size={48} className="text-muted" />
          <h3>No Workouts Found</h3>
          <p className="text-muted text-sm">
            {searchTerm || selectedType !== 'All'
              ? 'No workouts match your active filter criteria. Try adjusting your search.'
              : 'You have not recorded any workouts yet. Click below to add your first entry.'}
          </p>
          <Link to="/add-workout" className="btn btn-primary margin-top-sm">
            Log New Workout
          </Link>
        </div>
      ) : (
        <div className="workout-history-grid space-y-4">
          {filteredWorkouts.map((workout) => {
            const workoutId = workout._id || workout.id;
            return (
              <div key={workoutId} className="card-panel workout-card-item">
                <div className="workout-card-header flex-between flex-wrap gap-2">
                  <div className="flex-align-center gap-3">
                    <span className={getCategoryBadgeClass(workout.workoutType)}>
                      {workout.workoutType}
                    </span>
                    <h3 className="workout-card-title">{workout.exerciseName}</h3>
                  </div>

                  <div className="workout-card-actions flex-align-center gap-2">
                    <button
                      onClick={() => handleEditClick(workout)}
                      className="btn btn-ghost btn-sm btn-icon-only"
                      title="Edit Workout"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingWorkoutId(workoutId)}
                      className="btn btn-ghost-danger btn-sm btn-icon-only"
                      title="Delete Workout"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Workout Details Grid */}
                <div className="workout-details-grid margin-top-md">
                  <div className="detail-item">
                    <span className="detail-label flex-align-center gap-1">
                      <Calendar size={14} /> Date
                    </span>
                    <span className="detail-value">
                      {new Date(workout.workoutDate).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label flex-align-center gap-1">
                      <Clock size={14} /> Duration
                    </span>
                    <span className="detail-value">{workout.duration} mins</span>
                  </div>

                  {workout.workoutType === 'Strength' && (
                    <>
                      <div className="detail-item">
                        <span className="detail-label">Sets × Reps</span>
                        <span className="detail-value">
                          {workout.sets || 0} × {workout.reps || 0}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Weight</span>
                        <span className="detail-value">
                          {workout.weight ? `${workout.weight} kg` : 'Bodyweight'}
                        </span>
                      </div>
                    </>
                  )}

                  {workout.workoutType !== 'Strength' && (
                    <div className="detail-item">
                      <span className="detail-label">Est. Burn</span>
                      <span className="detail-value">{Math.round(workout.duration * 8)} kcal</span>
                    </div>
                  )}
                </div>

                {/* Notes if available */}
                {workout.notes && (
                  <div className="workout-notes-box margin-top-sm">
                    <span className="notes-label">Notes:</span> {workout.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Workout Modal */}
      <EditWorkoutModal
        workout={editingWorkout}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingWorkout(null);
        }}
        onSave={handleSaveUpdate}
      />

      {/* Delete Confirmation Modal */}
      {deletingWorkoutId && (
        <div className="modal-backdrop" onClick={() => setDeletingWorkoutId(null)}>
          <div className="modal-container max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex-align-center gap-2 text-danger">
                <AlertTriangle size={22} />
                <h3 className="modal-title">Delete Workout Entry?</h3>
              </div>
            </div>
            <div className="modal-body py-4">
              <p className="text-muted">
                Are you sure you want to delete this workout from your history? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeletingWorkoutId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteConfirm(deletingWorkoutId)}>
                Delete Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistoryPage;
