import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkouts } from '../context/WorkoutContext';
import { User, Mail, Award, Dumbbell, Clock, Shield, LogOut, CheckCircle2 } from 'lucide-react';

const ProfilePage = ({ showToast }) => {
  const { user, setUser, logout } = useAuth();
  const { totalWorkouts, totalDuration, totalExercises } = useWorkouts();

  const [name, setName] = useState(user?.name || '');
  const [fitnessGoal, setFitnessGoal] = useState('Build Muscle & Endurance');
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      const updatedUser = { ...user, name };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSaving(false);
      showToast('Profile details updated successfully!', 'success');
    }, 400);
  };

  return (
    <div className="profile-page-container max-w-4xl mx-auto space-y-6">
      {/* Header Profile Hero */}
      <div className="card-panel profile-hero-card">
        <div className="flex-align-center gap-4 flex-wrap">
          <div className="profile-large-avatar">
            {(name ? name.charAt(0) : 'U').toUpperCase()}
          </div>
          <div>
            <h1 className="profile-name">{name || 'Athlete'}</h1>
            <p className="profile-email flex-align-center gap-1 text-muted">
              <Mail size={16} />
              {user?.email || 'user@example.com'}
            </p>
            <div className="badge-pill margin-top-xs">
              <Shield size={12} className="brand-accent" />
              <span>MERN Authenticated Member</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Performance Summary */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Workouts</span>
            <div className="stat-icon-wrapper icon-emerald">
              <Dumbbell size={20} />
            </div>
          </div>
          <div className="stat-value">{totalWorkouts}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Training Time</span>
            <div className="stat-icon-wrapper icon-violet">
              <Clock size={20} />
            </div>
          </div>
          <div className="stat-value">{totalDuration} <span className="stat-unit">mins</span></div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Exercises Mastered</span>
            <div className="stat-icon-wrapper icon-cyan">
              <Award size={20} />
            </div>
          </div>
          <div className="stat-value">{totalExercises}</div>
        </div>
      </div>

      {/* Profile Settings Form */}
      <div className="card-panel">
        <h2 className="panel-title mb-4 flex-align-center gap-2">
          <User className="brand-accent" size={22} />
          Account Settings
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
          <div className="form-group">
            <label className="form-label" htmlFor="profile-name">Full Name</label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-email">Email Address</label>
            <input
              id="profile-email"
              type="email"
              value={user?.email || ''}
              disabled
              className="form-input disabled-input"
            />
            <span className="text-muted text-xs">Email address cannot be modified once registered.</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="fitness-goal">Primary Fitness Goal</label>
            <select
              id="fitness-goal"
              value={fitnessGoal}
              onChange={(e) => setFitnessGoal(e.target.value)}
              className="form-select"
            >
              <option value="Build Muscle & Endurance">Build Muscle & Strength</option>
              <option value="Weight Loss & Fat Burn">Weight Loss & Fat Burn</option>
              <option value="Cardio Conditioning">Cardio Conditioning</option>
              <option value="General Health & Flexibility">General Health & Flexibility</option>
            </select>
          </div>

          <div className="pt-2 flex-align-center gap-3">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <CheckCircle2 size={18} />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
            <button type="button" onClick={logout} className="btn btn-outline-danger">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
