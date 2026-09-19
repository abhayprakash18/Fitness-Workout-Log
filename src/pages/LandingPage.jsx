import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Activity, Calendar, Zap, Shield, ChevronRight, TrendingUp, Award } from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge-pill">
            <Zap size={14} className="brand-accent" />
            <span>Smart MERN Stack Fitness Platform</span>
          </div>

          <h1 className="hero-title">
            Transform Your Fitness Routine with <span className="text-gradient">Fitness Workout Log</span>
          </h1>

          <p className="hero-subtitle">
            Log your sets, reps, weight, and cardio workouts effortlessly. Track your consistency, calculate total training duration, and achieve your peak physical goals with our intuitive workout tracker.
          </p>

          <div className="hero-cta-buttons">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                <span>Go to Dashboard</span>
                <ChevronRight size={20} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  <span>Get Started Free</span>
                  <ChevronRight size={20} />
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  <span>Member Login</span>
                </Link>
              </>
            )}
          </div>

          {/* Quick Metrics Banner */}
          <div className="hero-stats-banner">
            <div className="hero-stat-item">
              <span className="hero-stat-value">100%</span>
              <span className="hero-stat-label">REST API Driven</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">5+</span>
              <span className="hero-stat-label">Workout Categories</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">Real-Time</span>
              <span className="hero-stat-label">Progress Analytics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="features-section">
        <div className="section-header text-center">
          <h2 className="section-title">Everything You Need To Build Consistency</h2>
          <p className="section-subtitle">
            Designed for bodybuilders, runners, crossfitters, and everyday athletes.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper icon-emerald">
              <Dumbbell size={28} />
            </div>
            <h3 className="feature-title">Detailed Workout Logging</h3>
            <p className="feature-desc">
              Log strength, cardio, HIIT, and flexibility workouts with exact sets, reps, weights, and dates.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper icon-violet">
              <Activity size={28} />
            </div>
            <h3 className="feature-title">Interactive Dashboard</h3>
            <p className="feature-desc">
              View live total workout count, total training time in minutes, and distinct exercises executed.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper icon-cyan">
              <Calendar size={28} />
            </div>
            <h3 className="feature-title">Search & Filter History</h3>
            <p className="feature-desc">
              Search by exercise name, filter by workout type (Strength, Cardio, HIIT, etc.), and sort chronologically.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper icon-amber">
              <TrendingUp size={28} />
            </div>
            <h3 className="feature-title">Edit & Delete Control</h3>
            <p className="feature-desc">
              Full control over your workout data via REST API endpoints (`PUT` and `DELETE` /api/workouts).
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2>Ready to Level Up Your Workout Tracking?</h2>
          <p>Join thousands logging their progress with Fitness Workout Log today.</p>
          <div className="margin-top-md">
            <Link to={isAuthenticated ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
              <span>{isAuthenticated ? 'Open Your Dashboard' : 'Start Logging Workouts'}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
