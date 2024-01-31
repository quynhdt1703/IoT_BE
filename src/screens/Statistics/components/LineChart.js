import {
  CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title,
  Tooltip
} from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ deviceItem, type }) => {

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: { display: true },
  //     scales: {
  //       xAxes: [{ ticks: { min: 40, max: 160 } }],
  //       yAxes: [{ ticks: { min: 6, max: 16 } }],
  //     },
  //     title: {
  //       display: true,
  //       text: 'CO2 history',
  //     },
  //   },
  // };

  let label = []
  let co2 = []
  deviceItem?.forEach(element => {
    label.push(element?.at)
    co2.push(element?.co2)
  });


  // const data = {
  //   label,
  //   datasets: [
  //     {
  //       label: 'CO2',
  //       data: co2,
  //       borderColor: 'red',
  //       backgroundColor: 'red',
  //     },
  //   ]
  // };
  // console.log('hiel', options, data)
  // return (
  //   <div style={{ marginTop: '80px' }}>
  //     <Line options={options} data={data} />
  //   </div>
  // )
  return (
    <div style={{ width: '50%' }}>
      <Line
        data={{
          labels: label,
          datasets: [
            {
              data: co2,
              label: "Asia",
              borderColor: "#8e5ea2",
              fill: false
            },
          ]
        }}
        options={{
          title: {
            display: true,
            text: "Statistics of CO2"
          },
          legend: {
            display: true,
            position: "top"
          }
        }}
      />
    </div>
  )
}
export default LineChart
