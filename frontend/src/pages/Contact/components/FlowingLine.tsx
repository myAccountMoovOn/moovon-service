import React from 'react';

export const FlowingLine: React.FC = () => {
  return (
    <div style={{ width: '100%', overflow: 'hidden', margin: '40px 0 0' }}>
      <svg
        width="100%"
        height="70"
        viewBox="0 0 1200 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="flowingLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <path
          d="M 0 35 C 300 70, 600 0, 900 45 C 1050 65, 1150 20, 1200 35"
          stroke="url(#flowingLineGrad)"
          strokeWidth="3"
          fill="none"
        />

        {/* Faint parallel accent line */}
        <path
          d="M 0 42 C 300 77, 600 7, 900 52 C 1050 72, 1150 27, 1200 42"
          stroke="rgba(124, 58, 237, 0.25)"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </div>
  );
};
