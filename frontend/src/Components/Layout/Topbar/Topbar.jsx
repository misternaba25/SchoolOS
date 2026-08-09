import React, {useState} from 'react';
import Sidebar from '../Sidebar/sidebar';


export default function Topbar() {

  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__menu-btn"
                onClick={onToggle}
        >☰</button>
        <div className="topbar__search">
          🔍 <input type="text" placeholder="Rechercher un élève, un prof, une classe..." />
        </div>
      </div>

      <div className="topbar__right">
        <button className="icon-btn">
          🔔 <span className="badge-count">3</span>
        </button>
        <div className="topbar__user">
          <div className="avatar-fallback">AD</div>
          <div>
            <strong>Administrateur</strong>
            <span>Directeur</span>
          </div>
        </div>
      </div>
    </header>
  );
}