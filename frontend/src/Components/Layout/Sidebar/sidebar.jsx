import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand__logo">🏫</div>
        <div className="sidebar-brand__text">
          <strong>SchoolOS</strong>
          <span>Gestion Scolaire</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "is-active" : ""}>
          <span className="icon">📊</span> Tableau de bord
        </NavLink>
        <NavLink to="/admin/eleves" className={({ isActive }) => isActive ? "is-active" : ""}>
          <span className="icon">🎓</span> Élèves
        </NavLink>
        <NavLink to="/admin/professeurs" className={({ isActive }) => isActive ? "is-active" : ""}>
          <span className="icon">🧑‍🏫</span> Professeurs
        </NavLink>
        <NavLink to="/admin/classes" className={({ isActive }) => isActive ? "is-active" : ""}>
          <span className="icon">🏫</span> Classes
        </NavLink>
        <NavLink to="/admin/matieres" className={({ isActive }) => isActive ? "is-active" : ""}>
          <span className="icon">📘</span> Matières
        </NavLink>
        <NavLink to="/admin/notes" className={({ isActive }) => isActive ? "is-active" : ""}>
          <span className="icon">📝</span> Notes
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer__school">
          <div className="badge">🏛️</div>
          <strong>Collège F.X. Vogt</strong>
        </div>
        <div className="sidebar-footer__year">
          <span>Année Scolaire: 2025-2026</span>
        </div>
      </div>
    </aside>
  );
}