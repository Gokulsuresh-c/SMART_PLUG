const apiKey = 'AGD6ZD4MM8Q7TTJV'; // Replace with your ThingSpeak Read API Key
const writeKey = 'L2TDJ1Y4WC0HTNAQ'; // Replace with your ThingSpeak Write API Key
const channelId = '2716153'; // Replace with your ThingSpeak Channel ID

// Initialize chart elements
const voltageChart = new Chart(document.getElementById("voltageChart"), {
    type: 'line',
    data: {
        labels: [], // Will be filled with time labels
        datasets: [{
            label: 'Voltage', // Changed label to "Current (A)"
            borderColor: '#00ff00',
            backgroundColor: 'rgba(0, 255, 0, 0.2)',
            data: []
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                min: 0,
                max: 5, // Set y-axis range from 0 to 5
                title: {
                    display: true,
                    text: 'Voltage (A)' // Label the y-axis as "CURRENT"
                }
            }
        }
    }
});
const currentChart = new Chart(document.getElementById("currentChart"), {
    type: 'line',
    data: {
        labels: [], // Will be filled with time labels
        datasets: [{
            label: 'Current', // Changed label to "Current (A)"
            borderColor: '#00ff00',
            backgroundColor: 'rgba(0, 255, 0, 0.2)',
            data: []
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                min: 0,
                max: 5, // Set y-axis range from 0 to 5
                title: {
                    display: true,
                    text: 'CURRENT (A)' // Label the y-axis as "CURRENT"
                }
            }
        }
    }
});

// Add new charts for frequency, power factor, and energy
const frequencyChart = new Chart(document.getElementById("frequencyChart"), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Frequency (Hz)',
            borderColor: '#ff4500',
            backgroundColor: 'rgba(255, 69, 0, 0.2)',
            data: []
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                min: 0,
                max: 60, // Set y-axis range from 0 to 60 Hz
                title: {
                    display: true,
                    text: 'Frequency (Hz)' // Label the y-axis as "Frequency (Hz)"
                }
            }
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
            x: {
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                min: 0,
                max: 1, // Power Factor range from 0 to 1
                title: {
                    display: true,
                    text: 'Power Factor'
                }
            }
        }
    }
});

const energyChart = new Chart(document.getElementById("energyChart"), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Energy (Wh)',
            borderColor: '#32cd32',
            backgroundColor: 'rgba(50, 205, 50, 0.2)',
            data: []
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                min: 0,
                max: 1000, // Energy range, can be adjusted based on expected values
                title: {
                    display: true,
                    text: 'Energy (Wh)'
                }
            }
        }
    }
});

let voltageData = [];
let currentData = [];
let powerData = [];
let frequencyData = [];
let powerFactorData = [];
let energyData = [];
let timeLabels = [];

// Fetch data from ThingSpeak
async function fetchData() {
    const response = await fetch(`https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=96`);
    const data = await response.json();

    voltageData = [];
    currentData = [];
    powerData = [];
    frequencyData = [];
    powerFactorData = [];
    energyData = [];
    timeLabels = [];

    data.feeds.forEach(feed => {
        voltageData.push(parseFloat(feed.field1));
        currentData.push(parseFloat(feed.field2));
        powerData.push(parseFloat(feed.field1) * parseFloat(feed.field2)); // Calculate power
        frequencyData.push(parseFloat(feed.field4)); // Assuming field4 contains frequency data
        powerFactorData.push(parseFloat(feed.field5)); // Assuming field5 contains power factor data
        energyData.push(parseFloat(feed.field6)); // Assuming field6 contains energy data
        timeLabels.push(new Date(feed.created_at).toLocaleTimeString());
    });

    updateCharts();
}

// Update the charts
function updateCharts() {
    voltageChart.data.labels = timeLabels;
    voltageChart.data.datasets[0].data = voltageData;
    voltageChart.update();

    currentChart.data.labels = timeLabels;
    currentChart.data.datasets[0].data = currentData;
    currentChart.update();

    powerChart.data.labels = timeLabels;
    powerChart.data.datasets[0].data = powerData;
    powerChart.update();

    frequencyChart.data.labels = timeLabels;
    frequencyChart.data.datasets[0].data = frequencyData;
    frequencyChart.update();

    powerFactorChart.data.labels = timeLabels;
    powerFactorChart.data.datasets[0].data = powerFactorData;
    powerFactorChart.update();

    energyChart.data.labels = timeLabels;
    energyChart.data.datasets[0].data = energyData;
    energyChart.update();
}

// Schedule LED control
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

// LED toggle function
async function toggleLed(state) {
    const status = state ? 1 : 0;
    document.getElementById("switchLabel").textContent = state ? "ON" : "OFF"; // Update label text
    await fetch(`https://api.thingspeak.com/update?api_key=${writeKey}&field3=${status}`);
}

// Initialize switch and data fetch intervals
document.getElementById("ledSwitch").addEventListener("change", function () {
    toggleLed(this.checked);
});

// Set up interval to fetch data every 15 seconds
setInterval(fetchData, 15000);
fetchData();