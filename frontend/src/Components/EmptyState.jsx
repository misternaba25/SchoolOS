import React from 'react';

export default function EmptyState({ icon, title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  );
}