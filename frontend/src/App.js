import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import Navbar from './Components/Layout/Navbar/navbar';
import DashBoardAdmin from './pages/admin/DashBoardAdmin';
import AdminLayout from './Components/AdminLayout';

const PlaceholderPage = ({ title }) => (
  <div className="page-content">
    <h2>{title}</h2>
    <p>Cette section est en cours de développement.</p>
  </div>
);

function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
        <Routes>
        {/* Redirection automatique vers /admin/dashboard */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Route parente pour l'Espace Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashBoardAdmin />} />
          <Route path="eleves" element={<PlaceholderPage title="Gestion des Élèves" />} />
          <Route path="professeurs" element={<PlaceholderPage title="Gestion des Professeurs" />} />
          <Route path="classes" element={<PlaceholderPage title="Gestion des Classes" />} />
          <Route path="matieres" element={<PlaceholderPage title="Gestion des Matières" />} />
          <Route path="notes" element={<PlaceholderPage title="Gestion des Notes" />} />
        </Route>

        {/* Capture des routes inconnues */}
        <Route path="*" element={<div>Page non trouvée</div>} />
      </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
