const apiKey = 'YOUR_API_KEY'; // Replace with your Twelve Data API key

async function getPrice() {
  const symbol = document.getElementById("symbol").value.trim();
  if (!symbol) return;

  // Get current price
  const res = await fetch(`https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apiKey}`);
  const data = await res.json();

  if (data.code) {
    document.getElementById("output").innerText = `Error: ${data.message}`;
    return;
  }

  document.getElementById("output").innerText = `Price: ${data.price} AED`;

  // Get time series data for chart
  const chartRes = await fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=30&apikey=${apiKey}`);
  const chartData = await chartRes.json();

  if (chartData.code) {
    console.log("Chart error:", chartData.message);
    return;
  }

  const labels = chartData.values.map(v => v.datetime).reverse();
  const prices = chartData.values.map(v => parseFloat(v.close)).reverse();

  drawChart(labels, prices);
}

function drawChart(labels, prices) {
  const ctx = document.getElementById("chart").getContext("2d");

  if (window.myChart) window.myChart.destroy(); // Clear old chart

  window.myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Price (AED)',
        data: prices,
        borderColor: 'blue',
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: { display: false },
        y: { beginAtZero: false }
      }
    }
  });
}
