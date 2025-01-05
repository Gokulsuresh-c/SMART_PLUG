const apiKey = "Z9I8A8CEOFKGXNNN"; // Replace with your ThingSpeak Read API Key
const channelId = "2800872"; // Replace with your Channel ID
const writeAPIKey = "IG4STQXCWCJ3L813"; // Replace with your ThingSpeak Write API Key

// Chart Initialization
const chartsConfig = [
    { id: "voltageChart", label: "Voltage (V)", color: '#ff0000', min: 0, max: 300 },
    { id: "currentChart", label: "Current (A)", color: '#00ff00', min: 0, max: 5 },
    { id: "powerChart", label: "Power (W)", color: '#0000ff', min: 0, max: 1500 },
    { id: "frequencyChart", label: "Frequency (Hz)", color: '#ffa500', min: 0, max: 60 },
    { id: "powerFactorChart", label: "Power Factor", color: '#800080', min: 0, max: 1 },
    { id: "energyChart", label: "Energy (kWh)", color: '#008080', min: 0, max: 25 }
];

const charts = chartsConfig.reduce((acc, config) => {
    acc[config.id] = new Chart(document.getElementById(config.id), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: config.label,
                borderColor: config.color,
                backgroundColor: `${config.color}20`,
                data: []
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Time' } },
                y: { min: config.min, max: config.max, title: { display: true, text: config.label } }
            }
        }
    });
    return acc;
}, {});

let dataSets = {
    voltage: [],
    current: [],
    power: [],
    frequency: [],
    powerFactor: [],
    energy: [],
    timeLabels: []
};

// Fetch data from ThingSpeak
async function fetchData() {
    const response = await fetch(`https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=96`);
    const data = await response.json();

    dataSets = { voltage: [], current: [], power: [], frequency: [], powerFactor: [], energy: [], timeLabels: [] };

    data.feeds.forEach(feed => {
        dataSets.voltage.push(parseFloat(feed.field1));
        dataSets.current.push(parseFloat(feed.field2));
        dataSets.power.push(parseFloat(feed.field1) * parseFloat(feed.field2)); // Calculate power
        dataSets.frequency.push(parseFloat(feed.field3));
        dataSets.powerFactor.push(parseFloat(feed.field4));
        dataSets.energy.push(parseFloat(feed.field5));
        dataSets.timeLabels.push(new Date(feed.created_at).toLocaleTimeString());
    });

    updateCharts();
}

// Update Charts
function updateCharts() {
    chartsConfig.forEach((config, index) => {
        const dataKey = Object.keys(dataSets)[index];
        charts[config.id].data.labels = dataSets.timeLabels;
        charts[config.id].data.datasets[0].data = dataSets[dataKey];
        charts[config.id].update();
    });
}

// Schedule LED Control
function scheduleLed() {
    const scheduleTime = document.getElementById("scheduleTime").value;
    if (scheduleTime) {
        const now = new Date();
        const [hours, minutes] = scheduleTime.split(":").map(Number);
        const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

        const delay = scheduledTime.getTime() - now.getTime();

        if (delay > 0) {
            setTimeout(() => toggleLed(true), delay);
            alert(`LED scheduled to turn on at ${scheduleTime}`);
        } else {
            alert("Please select a future time.");
        }
    }
}

// Toggle LED
async function toggleLed(state) {
    const status = state ? 1 : 0;
    document.getElementById("switchLabel").textContent = state ? "ON" : "OFF";
    await fetch(`https://api.thingspeak.com/update?api_key=${writeAPIKey}&field6=${status}`);
}

document.getElementById("ledSwitch").addEventListener("change", function () {
    toggleLed(this.checked);
});

// Fetch data every 15 seconds
setInterval(fetchData, 15000);
fetchData();
