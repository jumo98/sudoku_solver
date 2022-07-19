import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';
import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Algorithm Duration in ms',
    },
  }
};

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const AlgorithmChart = (props) => {
    const labels = []
    const datasets = []

    let data = []
    for (const [key, value] of Object.entries(props.data)) {
        data.push(value)
        labels.push(key)
        
      }
      datasets.push({
        label: "Runtime",
        data: data,
        borderColor: 'rgb(255, 99, 132)',
  backgroundColor: 'rgba(255, 99, 132, 0.5)',
    })

      const chart = {
        labels,
        datasets: datasets,
      }

    console.log(props.data)
    return (
        <div>
            <Bar options={options} data={chart} />
        </div>
    )
}