import { useState } from 'react';
import { X, Save, Dumbbell } from 'lucide-react';

const getInitialFormData = (workout) => {
  if (!workout) {
    return {
      exerciseName: '',
      workoutType: 'Strength',
      sets: '',
      reps: '',
      weight: '',
      duration: '',
      workoutDate: '',
      notes: '',
    };
  }
  const rawDate = workout.workoutDate || workout.date;
  let dateString = new Date().toISOString().substring(0, 10);
  if (rawDate) {
    try {
      if (typeof rawDate === 'string') {
        dateString = rawDate.substring(0, 10);
      } else if (rawDate instanceof Date) {
        dateString = rawDate.toISOString().substring(0, 10);
      } else {
        dateString = new Date(rawDate).toISOString().substring(0, 10);
      }
    } catch {
      dateString = new Date().toISOString().substring(0, 10);
    }
  }
  return {
    exerciseName: workout.exerciseName || '',
    workoutType: workout.workoutType || 'Strength',
    sets: workout.sets !== undefined ? workout.sets : '',
    reps: workout.reps !== undefined ? workout.reps : '',
    weight: workout.weight !== undefined ? workout.weight : '',
    duration: workout.duration !== undefined ? workout.duration : '',
    workoutDate: dateString,
    notes: workout.notes || '',
  };
};

const EditWorkoutModal = ({ workout, isOpen, onClose, onSave }) => {
  const [prevWorkout, setPrevWorkout] = useState(null);
  const [formData, setFormData] = useState(() => getInitialFormData(workout));
  const [submitting, setSubmitting] = useState(false);

  if (workout !== prevWorkout) {
    setPrevWorkout(workout);
    setFormData(getInitialFormData(workout));
  }

  if (!isOpen || !workout) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(workout._id || workout.id, {
        ...formData,
        sets: Number(formData.sets),
        reps: Number(formData.reps),
        weight: Number(formData.weight),
        duration: Number(formData.duration),
      });
      onClose();
    } catch (err) {
      console.error('Failed to update workout:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex-align-center gap-2">
            <Dumbbell className="brand-accent" size={22} />
            <h3 className="modal-title">Edit Workout Details</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body space-y-4">
          <div className="form-group">
            <label className="form-label">Exercise Name</label>
            <input
              type="text"
              name="exerciseName"
              value={formData.exerciseName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Workout Type</label>
              <select
                name="workoutType"
                value={formData.workoutType}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="Flexibility">Flexibility</option>
                <option value="HIIT">HIIT</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Workout Date</label>
              <input
                type="date"
                name="workoutDate"
                value={formData.workoutDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Sets</label>
              <input
                type="number"
                min="0"
                name="sets"
                value={formData.sets}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. 4"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Reps</label>
              <input
                type="number"
                min="0"
                name="reps"
                value={formData.reps}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. 10"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Weight (kg/lbs)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. 75"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Duration (Minutes)</label>
            <input
              type="number"
              min="1"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Progress Comments</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="form-textarea"
              placeholder="Add details about intensity, mood, or targets..."
            ></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Save size={18} />
              <span>{submitting ? 'Saving...' : 'Update Workout'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWorkoutModal;
