import React from 'react';

export default function StatCard({ icon, bgClass, label, value, delta = "+0,0% ce mois" }) {
  return (
    <div className="card stat-card">
      <div className="stat-card__top">
        <div className={`stat-card__icon ${bgClass}`}>{icon}</div>
        <div>
          <div className="stat-card__label">{label}</div>
          <div className="stat-card__value">{value}</div>
        </div>
      </div>
      <span className="stat-card__delta flat">{delta}</span>
    </div>
  );
}