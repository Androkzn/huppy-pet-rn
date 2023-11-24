import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';
import "chartjs-plugin-datalabels";
ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

 

const ChartPie = ({ data }) => {
  // Calculate total weight
  const totalWeight = data.reduce((sum, item) => sum + item.weight, 0);

  // Prepare data for the chart
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.weight),
        backgroundColor: data.map(item => item.color),
        hoverOffset: 4
      },
    ],
  };

  // Chart options
  const options = {
    cutout: '60%', // Adjust inner circle size as needed
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = data[context.dataIndex].name;
            const weight = data[context.dataIndex].weight;
            const percentage = data[context.dataIndex].percentage;
            return `${label}: ${percentage}%`;
          },
        },
      },
      datalabels: {
        formatter: (value) => {
          return value + '%'
        },
        anchor: 'end',
          align: 'end',
          labels: {
            value: {
              color: 'blue'
            }
          }
      },
      
      doughnutlabel: { // plugin scope
        paddingPercentage: 5,
        labels: [
          { // label scope
            text: 'Text' ,
            font: {
              size: '24',
              family: 'Arial, Helvetica, sans-serif',
              style: 'italic',
              weight: 'bold',
            },
            color: '#bc2c1a',
          },
        ],
      },
    },
  };

  return (
    <div>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default ChartPie;
