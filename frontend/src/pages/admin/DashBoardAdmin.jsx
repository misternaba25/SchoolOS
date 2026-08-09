import React from 'react';
import StatCard from '../../Components/StatCard';
import EmptyState from '../../Components/EmptyState.jsx';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

export default function DashBoardAdmin() {
  // Données de graphiques
  const lineData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil"],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0, 0],
      borderColor: "#7c3aed",
      backgroundColor: "rgba(124,58,237,0.08)",
      fill: true,
      tension: 0.35,
    }]
  };

  const barData = {
    labels: ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Tle"],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "#7c3aed",
      borderRadius: 6,
    }]
  };

  const doughnutData = {
    labels: ["Frais de scolarité", "Cantine", "Transport", "Uniforme", "Examens"],
    datasets: [{
      data: [1, 1, 1, 1, 1],
      backgroundColor: ["#7c3aed", "#3b82f6", "#17b26a", "#f59e0b", "#ef4444"],
      borderWidth: 0,
    }]
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };

  return (
    <div className="page-content">
      {/* Bloc Bienvenue */}
      <section className="welcome-card">
        <div>
          <h1>Bienvenue Administrateur 👋</h1>
          <p>Voici un aperçu de ce qui se passe dans votre établissement aujourd'hui.</p>
          <button className="btn btn-primary">Générer un rapport 📄</button>
        </div>
      </section>

      {/* Statistiques */}
      <section className="stat-grid" style={{ marginTop: '22px' }}>
        <StatCard icon="🎓" bgClass="bg-purple" label="Élèves" value="0" />
        <StatCard icon="🧑‍🏫" bgClass="bg-blue" label="Professeurs" value="0" />
        <StatCard icon="🏫" bgClass="bg-green" label="Classes" value="0" />
        <StatCard icon="💰" bgClass="bg-orange" label="Paiements du mois" value="0 FCFA" />
      </section>

      {/* Graphiques */}
      <section className="charts-grid">
        <div className="card">
          <div className="card-header">
            <h3>Évolution des inscriptions</h3>
          </div>
          <div className="card-body">
            <div className="chart-canvas-wrap">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Répartition par classe</h3>
          </div>
          <div className="card-body">
            <div className="chart-canvas-wrap">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Paiements mensuels</h3>
          </div>
          <div className="card-body">
            <div className="chart-canvas-wrap donut">
              <Doughnut data={doughnutData} options={{ ...chartOptions, cutout: '72%' }} />
              <div className="donut-center">
                <strong>0 FCFA</strong>
                <span>Total</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listes & Tableaux */}
      <section className="two-col">
        <div className="card">
          <div className="table-toolbar">
            <h3>Gestion des élèves</h3>
            <button className="btn btn-primary">+ Ajouter un élève</button>
          </div>
          <EmptyState icon="🎓" title="Aucun élève enregistré" description="Ajoutez un élève ou importez une liste depuis Excel." />
        </div>

        <div className="card">
          <div className="table-toolbar">
            <h3>Paiements récents</h3>
          </div>
          <EmptyState icon="💳" title="Aucun paiement enregistré" description="Les paiements récents s'afficheront ici." />
        </div>
      </section>
    </div>
  );
}