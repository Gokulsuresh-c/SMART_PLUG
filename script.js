// ThingSpeak Configuration
const apiKey = 'Z9I8A8CEOFKGXNNN'; // Replace with your ThingSpeak Read API Key
const channelId = '2800872'; // Replace with your ThingSpeak Channel ID

// Navigation Logic
document.getElementById('relay-operation-btn').addEventListener('click', () => {
    document.getElementById('starting-page').classList.add('hidden');
    document.getElementById('relay-operation-page').classList.remove('hidden');
    fetchRelayStatus();
});

document.getElementById('load-monitoring-btn').addEventListener('click', () => {
    document.getElementById('starting-page').classList.add('hidden');
    document.getElementById('load-monitoring-page').classList.remove('hidden');
    fetchData(); // Fetch data for load monitoring
});

document.querySelectorAll('#back-to-home').forEach(button => {
    button.addEventListener('click', () => {
        document.getElementById('relay-operation-page').classList.add('hidden');
        document.getElementById('load-monitoring-page').classList.add('hidden');
        document.getElementById('starting-page').classList.remove('hidden');
    });
});

// Fetch Relay Status from ThingSpeak
async function fetchRelayStatus() {
    const response = await fetch(`https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=1`);
    const data = await response.json();
    const relayStatus = data.feeds[0];

    document.getElementById('relay1-status').textContent = relayStatus.field1 === '1' ? 'ON' : 'OFF';
    document.getElementById('relay1-status').style.color = relayStatus.field1 === '1' ? 'green' : 'red';

    document.getElementById('relay2-status').textContent = relayStatus.field2 === '1' ? 'ON' : 'OFF';
    document.getElementById('relay2-status').style.color = relayStatus.field2 === '1' ? 'green' : 'red';

    document.getElementById('relay3-status').textContent = relayStatus.field3 === '1' ? 'ON' : 'OFF';
    document.getElementById('relay3-status').style.color = relayStatus.field3 === '1' ? 'green' : 'red';
}

// Initialize Charts for Load Monitoring
const voltageChart = new Chart(document.getElementById("voltageChart"), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Voltage',
            borderColor: '#00ff00',
            backgroundColor: 'rgba(0, 255, 0, 0.2)',
            data: []
        }]
    },
    options: {
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { min: 0, max: 260, title: { display: true, text: 'Voltage (V)' } }
        }
    }
});

const currentChart = new Chart(document.getElementById("currentChart"), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Current',
            borderColor: '#ff0000',
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            data: []
        }]
    },
    options: {
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { min: 0, max: 10, title: { display: true, text: 'Current (A)' } }
        }
    }
});

// Add other charts (power, frequency, power factor, energy) similarly...

// Fetch Data for Load Monitoring
async function fetchData() {
    const response = await fetch(`https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=96`);
    const data = await response.json();

    const voltageData = data.feeds.map(feed => parseFloat(feed.field1));
    const currentData = data.feeds.map(feed => parseFloat(feed.field2));
    const timeLabels = data.feeds.map(feed => new Date(feed.created_at).toLocaleTimeString());

    voltageChart.data.labels = timeLabels;
    voltageChart.data.datasets[0].data = voltageData;
    voltageChart.update();

    currentChart.data.labels = timeLabels;
    currentChart.data.datasets[0].data = currentData;
    currentChart.update();
}

// Fetch data every 15 seconds
setInterval(fetchData, 15000);
fetchData();
