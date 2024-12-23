import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Enregistrer les composants nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MarketChart = () => {
  // Données pour les 5 dernières années avec augmentation de 3.5% par an
  const years = ['2019', '2020', '2021', '2022', '2023'];
  const baseValue = 1000000; // Prix de base en 2019
  const data = years.map((_, index) => {
    return Math.round(baseValue * Math.pow(1.035, index));
  });

  const chartData = {
    labels: years,
    datasets: [
      {
        label: 'Prix moyen du marché (₪)',
        data: data,
        borderColor: '#9c27b0',
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Évolution du marché immobilier en Israël',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `Prix: ₪${(value/1000000).toFixed(2)}M`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `₪${(value/1000000).toFixed(1)}M`,
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MarketChart; 