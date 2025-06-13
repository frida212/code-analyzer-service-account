import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Issue } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface IssuesChartProps {
  issues: Issue[];
}

const IssuesChart: React.FC<IssuesChartProps> = ({ issues }) => {
  const issuesByType = issues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: ['Security', 'Quality', 'Performance'],
    datasets: [{
      data: [
        issuesByType.security || 0,
        issuesByType.quality || 0,
        issuesByType.performance || 0
      ],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(34, 197, 94, 0.8)'
      ],
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(245, 158, 11)',
        'rgb(34, 197, 94)'
      ],
      borderWidth: 2
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#ffffff',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1
      }
    }
  };

  return (
    <div className="h-80">
      <h3 className="text-lg font-semibold text-white mb-4">Issues by Type</h3>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default IssuesChart;