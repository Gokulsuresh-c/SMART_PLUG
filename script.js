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

const powerChart = new Chart(document.getElementById("powerChart"), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Power',
            borderColor: '#ffff00',
            backgroundColor: 'rgba(255, 255, 0, 0.2)',
            data: []
        }]
    },
    options: {
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { min: 0, max: 100, title: { display: true, text: 'Power (W)' } }
        }
    }
});

const frequencyChart = new Chart(document.getElementById("frequencyChart"), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Frequency',
            borderColor: '#ff4500',
            backgroundColor: 'rgba(255, 69, 0, 0.2)',
            data: []
        }]
    },
    options: {
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { min: 45, max: 65, title: { display: true, text: 'Frequency (Hz)' } }
        }
    }
});

const powerFactorChart = new Chart(document.getElementById("powerFactorChart"), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Power Factor',
            borderColor: '#1e90ff',
            backgroundColor: 'rgba(30, 144, 255, 0.2)',
            data: []
        }]
    },
    options: {
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { min: 0, max: 1, title: { display: true, text: 'Power Factor' } }
        }
    }
});

const energyChart = new Chart(document.getElementById("energyChart"), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Energy',
            borderColor: '#32cd32',
            backgroundColor: 'rgba(50, 205, 50, 0.2)',
            data: []
        }]
    },
    options: {
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { min: 0, max: 10, title: { display: true, text: 'Energy (kWh)' } }
        }
    }
});

// Fetch Data for Load Monitoring
async function fetchData() {
    const response = await fetch(`https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=96`);
    const data = await response.json();

    const voltageData = data.feeds.map(feed => parseFloat(feed.field1));
    const currentData = data.feeds.map(feed => parseFloat(feed.field2));
    const powerData = data.feeds.map(feed => parseFloat(feed.field1) * parseFloat(feed.field2));
    const frequencyData = data.feeds.map(feed => parseFloat(feed.field4));
    const powerFactorData = data.feeds.map(feed => parseFloat(feed.field5));
    const energyData = data.feeds.map(feed => parseFloat(feed.field6));
    const timeLabels = data.feeds.map(feed => new Date(feed.created_at).toLocaleTimeString());

    // Update Voltage Chart
    voltageChart.data.labels = timeLabels;
    voltageChart.data.datasets[0].data = voltageData;
    voltageChart.update();

    // Update Current Chart
    currentChart.data.labels = timeLabels;
    currentChart.data.datasets[0].data = currentData;
    currentChart.update();

    // Update Power Chart
    powerChart.data.labels = timeLabels;
    powerChart.data.datasets[0].data = powerData;
    powerChart.update();

    // Update Frequency Chart
    frequencyChart.data.labels = timeLabels;
    frequencyChart.data.datasets[0].data = frequencyData;
    frequencyChart.update();

    // Update Power Factor Chart
    powerFactorChart.data.labels = timeLabels;
    powerFactorChart.data.datasets[0].data = powerFactorData;
    powerFactorChart.update();

    // Update Energy Chart
    energyChart.data.labels = timeLabels;
    energyChart.data.datasets[0].data = energyData;
    energyChart.update();
}

// Fetch data every 15 seconds
setInterval(fetchData, 15000);
fetchData();
