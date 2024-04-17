import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/data');
      setData(response.data);
      plotData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const plotData = (data) => {
    const timestamps = data.map((item) => new Date(item.ts));
    const values = data.map((item) => item.machine_status);

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [{
          label: 'Machine Cycle Status',
          data: values,
          backgroundColor: values.map(value => value === 0 ? 'yellow' : (value === 1 ? 'green' : 'red')),
          fill: true
        }]
      }
    });
  };

  return (
    <div>
      <canvas id="myChart" width="0.1" height="0.1"></canvas>
    </div>
  );
}

export default App;