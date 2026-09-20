import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkouts } from '../context/WorkoutContext';
import { PlusCircle, Dumbbell, Calendar, Clock, Hash, Weight, FileText, ArrowLeft } from 'lucide-react';

const AddWorkoutPage = ({ showToast }) => {
  const { addWorkout } = useWorkouts();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    exerciseName: '',
    workoutType: 'Strength',
    sets: '',
    reps: '',
    weight: '',
    duration: '',
    workoutDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.exerciseName.trim()) {
      errs.exerciseName = 'Exercise Name is required.';
    }
    if (!formData.duration || Number(formData.duration) <= 0) {
      errs.duration = 'Please enter a valid workout duration in minutes.';
    }
    if (!formData.workoutDate) {
      errs.workoutDate = 'Workout Date is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const workoutPayload = {
      exerciseName: formData.exerciseName.trim(),
      workoutType: formData.workoutType,
      sets: formData.sets ? Number(formData.sets) : 0,
      reps: formData.reps ? Number(formData.reps) : 0,
      weight: formData.weight ? Number(formData.weight) : 0,
      duration: Number(formData.duration),
      workoutDate: formData.workoutDate,
      notes: formData.notes.trim(),
    };

    const result = await addWorkout(workoutPayload);
    setSubmitting(false);

    if (result.success) {
      showToast('Workout successfully recorded!', 'success');
      navigate('/history');
    } else {
      showToast('Error recording workout. Please try again.', 'error');
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-page-header">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm mb-2">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <h1 className="page-title flex-align-center gap-2">
          <PlusCircle className="brand-accent" size={28} />
          Log New Workout Session
        </h1>
        <p className="page-subtitle">Record your exercise metrics to keep your training history up to date.</p>
      </div>

      <div className="card-panel max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Exercise Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="exerciseName">
              Exercise Name <span className="text-danger">*</span>
            </label>
            <div className="input-with-icon">
              <Dumbbell className="input-icon" size={18} />
              <input
                id="exerciseName"
                type="text"
                name="exerciseName"
                placeholder="e.g. Bench Press, Treadmill Run, Deadlift"
                value={formData.exerciseName}
                onChange={handleChange}
                className={`form-input ${errors.exerciseName ? 'input-error' : ''}`}
              />
            </div>
            {errors.exerciseName && <span className="error-text">{errors.exerciseName}</span>}
          </div>

          {/* Workout Type & Date Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="workoutType">
                Workout Type <span className="text-danger">*</span>
              </label>
              <select
                id="workoutType"
                name="workoutType"
                value={formData.workoutType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="Flexibility">Flexibility</option>
                <option value="HIIT">HIIT</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="workoutDate">
                Workout Date <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <Calendar className="input-icon" size={18} />
                <input
                  id="workoutDate"
                  type="date"
                  name="workoutDate"
                  value={formData.workoutDate}
                  onChange={handleChange}
                  className={`form-input ${errors.workoutDate ? 'input-error' : ''}`}
                />
              </div>
              {errors.workoutDate && <span className="error-text">{errors.workoutDate}</span>}
            </div>
          </div>

          {/* Sets, Reps, Weight Grid */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label" htmlFor="sets">Sets</label>
              <div className="input-with-icon">
                <Hash className="input-icon" size={18} />
                <input
                  id="sets"
                  type="number"
                  min="0"
                  name="sets"
                  placeholder="e.g. 4"
                  value={formData.sets}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reps">Reps</label>
              <div className="input-with-icon">
                <Hash className="input-icon" size={18} />
                <input
                  id="reps"
                  type="number"
                  min="0"
                  name="reps"
                  placeholder="e.g. 10"
                  value={formData.reps}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="weight">Weight (kg / lbs)</label>
              <div className="input-with-icon">
                <Weight className="input-icon" size={18} />
                <input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.5"
                  name="weight"
                  placeholder="e.g. 80"
                  value={formData.weight}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="form-group">
            <label className="form-label" htmlFor="duration">
              Duration (Minutes) <span className="text-danger">*</span>
            </label>
            <div className="input-with-icon">
              <Clock className="input-icon" size={18} />
              <input
                id="duration"
                type="number"
                min="1"
                name="duration"
                placeholder="e.g. 45"
                value={formData.duration}
                onChange={handleChange}
                className={`form-input ${errors.duration ? 'input-error' : ''}`}
              />
            </div>
            {errors.duration && <span className="error-text">{errors.duration}</span>}
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label" htmlFor="notes">Notes / Observations</label>
            <div className="input-with-icon">
              <FileText className="input-icon top-3" size={18} />
              <textarea
                id="notes"
                name="notes"
                rows="3"
                placeholder="Optional notes e.g., Felt strong on set 3, increased bench weight..."
                value={formData.notes}
                onChange={handleChange}
                className="form-textarea"
              ></textarea>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="form-actions flex-align-center justify-end gap-3 pt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-md"
              disabled={submitting}
            >
              <PlusCircle size={18} />
              <span>{submitting ? 'Saving Workout...' : 'Save Workout Log'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkoutPage;
