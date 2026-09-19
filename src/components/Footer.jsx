import React from 'react';
import { Dumbbell, Heart, ShieldCheck, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="flex-align-center gap-2">
            <Dumbbell className="brand-accent" size={20} />
            <span className="brand-text">Fitness<span className="brand-accent">Log</span></span>
          </div>
          <p className="footer-tagline">
            Track workouts. Monitor progress. Reach peak performance.
          </p>
        </div>

        <div className="footer-meta">
          <div className="flex-align-center gap-1 text-muted text-sm">
            <span>Built with React & MERN Architecture</span>
          </div>
          <p className="text-muted text-xs margin-top-xs">
            &copy; {new Date().getFullYear()} Fitness Workout Log. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
