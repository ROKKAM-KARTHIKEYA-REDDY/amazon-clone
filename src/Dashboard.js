import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { FaLeaf, FaRecycle, FaUsers, FaGlobeAmericas } from 'react-icons/fa';
import './Dashboard.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const Dashboard = () => {
  // Sample data for CO2 savings over time
  const co2Data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'CO₂ Saved (kg)',
        data: [8, 10, 12, 9, 11, 12],
        borderColor: '#39ff14',
        backgroundColor: 'rgba(57,255,20,0.13)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#39ff14',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 7,
        pointHoverRadius: 10,
      },
    ],
  };

  // Neon golden color: #FFD700
  const plasticData = {
    labels: ['Plastic Saved', 'Remaining'],
    datasets: [
      {
        data: [50, 50],
        backgroundColor: ['#FFD700', 'rgba(255,215,0,0.10)'],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(16,19,26,0.95)',
        titleColor: '#39ff14',
        bodyColor: '#fff',
        borderColor: '#39ff14',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw} kg`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(57,255,20,0.10)',
        },
        ticks: {
          color: '#39ff14',
          font: {
            weight: 'bold'
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#39ff14',
          font: {
            weight: 'bold'
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(16,19,26,0.95)',
        titleColor: '#FFD700',
        bodyColor: '#fff',
        borderColor: '#FFD700',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
      }
    },
    cutout: '70%',
  };

  const batteryPercentage = 55; // You can make this dynamic

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">ECO PULSE DASHBOARD</h1>
      <div style={{color:'#baffc9', fontWeight:600, fontSize:'1.1rem', marginBottom:'2.5rem', textAlign:'center'}}>Your Sustainability Impact at a Glance</div>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3><FaLeaf style={{color:'#39ff14', filter:'drop-shadow(0 0 8px #39ff14)'}}/> CO₂ Saved</h3>
          <div className="metric-value">12 KG</div>
          <div className="metric-chart">
            <Line data={co2Data} options={chartOptions} />
          </div>
        </div>
        <div className="metric-card">
          <h3><FaRecycle style={{color:'#FFD700', filter:'drop-shadow(0 0 8px #FFD700)'}}/> Plastic Saved</h3>
          <div className="metric-value">50G</div>
          <div className="metric-chart">
            <Doughnut data={plasticData} options={doughnutOptions} />
          </div>
        </div>
        <div className="metric-card">
          <h3><FaUsers style={{color:'#39ff14', filter:'drop-shadow(0 0 8px #39ff14)'}}/> Community Rank</h3>
          <div className="metric-value">Greener than 80% of users</div>
          <div className="progress-bar">
            <div className="progress" style={{ width: '80%' }}></div>
          </div>
        </div>
        <div className="metric-card">
          <h3><FaGlobeAmericas style={{color:'#00cfff', filter:'drop-shadow(0 0 8px #00cfff)'}}/> Global Impact</h3>
          <div className="metric-value">1M KG CO₂ Saved</div>
          <div className="global-impact">
            <div className="impact-icon">🌍</div>
            <p>Contributed to Amazon's global sustainability goals</p>
          </div>
        </div>
      </div>
      {/* Battery Bar Below Cards */}
      <div className="battery-bar-container">
        <div className="battery-bar-outer">
          <div
            className="battery-bar-inner"
            style={{ width: `${batteryPercentage}%` }}
          >
            <div className="battery-segment-vert seg1"></div>
            <div className="battery-segment-vert seg2"></div>
            <div className="battery-segment-vert seg3"></div>
          </div>
          <div className="battery-bar-cap"></div>
          <div className="battery-segment"></div>
        </div>
        <div className="battery-bar-label">ECO PULSE {batteryPercentage}%</div>
      </div>
    </div>
  );
};

export default Dashboard;
