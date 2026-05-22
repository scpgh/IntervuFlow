import React, { useEffect, useState } from 'react';

export default function ScoreGauge({ score, size = 160, strokeWidth = 12 }) {
  const [offset, setOffset] = useState(0);
  const normalizedScore = Math.max(0, Math.min(10, score));
  const percentage = (normalizedScore / 10) * 100;
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    // Standard entry delay to animate the circular indicator smoothly
    const progressOffset = circumference - (percentage / 100) * circumference;
    const timer = setTimeout(() => {
      setOffset(progressOffset);
    }, 150);
    return () => clearTimeout(timer);
  }, [percentage, circumference]);

  // Color schemes based on score range
  let colorClass = 'stroke-brand-danger';
  let glowColor = 'rgba(239, 68, 68, 0.3)';
  let textClass = 'text-brand-danger';

  if (normalizedScore >= 7.5) {
    colorClass = 'stroke-brand-secondary';
    glowColor = 'rgba(16, 185, 129, 0.3)';
    textClass = 'text-brand-secondary';
  } else if (normalizedScore >= 5.0) {
    colorClass = 'stroke-brand-accent';
    glowColor = 'rgba(245, 158, 11, 0.3)';
    textClass = 'text-brand-accent';
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background Circle */}
        <circle
          className="stroke-brand-border"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Animated Progress Circle */}
        <circle
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            filter: `drop-shadow(0px 0px 6px ${glowColor})`
          }}
        />
      </svg>
      {/* Centered Scoring Metrics */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-3xl font-extrabold font-display ${textClass}`}>
          {normalizedScore.toFixed(1)}
        </span>
        <span className="text-xs text-brand-textMuted font-medium uppercase tracking-wider mt-0.5">
          Score / 10
        </span>
      </div>
    </div>
  );
}
