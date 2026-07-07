import React from 'react';

const TONE_MAP = {
  // Lead status
  Open: 'blue',
  Won: 'green',
  Lost: 'red',
  'On Hold': 'amber',
  Invalid: 'gray',
  // Priority
  High: 'red',
  Medium: 'amber',
  Low: 'green',
  // Follow-up status
  Overdue: 'red',
  'Due Today': 'amber',
  Upcoming: 'blue'
};

export default function Badge({ children, tone }) {
  const resolvedTone = tone || TONE_MAP[children] || 'gray';
  return <span className={`badge badge--${resolvedTone}`}>{children}</span>;
}
