// ThingSpeak API Keys and Channel ID
const apiKey = "Z9I8A8CEOFKGXNNN"; // Replace with your ThingSpeak Read API Key
const channelId = "2800872"; // Replace with your ThingSpeak Channel ID
const writeAPIKey = "IG4STQXCWCJ3L813"; // Replace with your ThingSpeak Write API Key for toggle switch
const updateInterval = 5000; // Update every 5 seconds

// Create chart containers
const charts = {};

// Function to create a chart with specified y-axis range
function createChart(chartId, label, minValue, maxValue) {
    const ctx = document.getElementById(chartId).getContext("2d");
    return new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: "minute"
                    }
                },
                y: {
                    min: minValue,
                    max: maxValue,
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to update chart data
function updateChart(chart, label, value) {
    if (chart.data.labels.length > 20) { // Keep only the last 20 points
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(value);
    chart.update();
}

// Fetch data from ThingSpeak
function fetchData() {
    fetch(`https://thingproxy.freeboard.io/fetch/https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=1`)
        .then(response => response.json())
        .then(data => {
            const feed = data.feeds[0]; // Latest data point
            const time = new Date(feed.created_at);

            // Update each graph with specified ranges
            updateChart(charts.voltage, time, parseFloat(feed.field1 || 0)); // Voltage (0-250V)
            updateChart(charts.current, time, parseFloat(feed.field2 || 0)); // Current (2-50A)
            updateChart(charts.power, time, parseFloat(feed.field3 || 0)); // Power (0-12500W)
            updateChart(charts.frequency, time, parseFloat(feed.field4 || 0)); // Frequency (0-50Hz)
            updateChart(charts.powerFactor, time, parseFloat(feed.field5 || 0)); // Power Factor (0-1)
            updateChart(charts.energy, time, parseFloat(feed.field6 || 0)); // Energy (0-300kWh)
        })
        .catch(error => console.error("Error fetching data:", error)); // Log any errors
}

// Toggle switch handler
function toggleSwitchHandler(event) {
    const value = event.target.checked ? 1 : 0;
    fetch(`https://api.thingspeak.com/update?api_key=${writeAPIKey}&field7=${value}`)
        .then(response => {
            if (response.ok) {
                console.log(`Toggle switch set to ${value}`);
            } else {
                console.error("Failed to update toggle switch value.");
            }
        })
        .catch(error => console.error("Error updating toggle switch:", error));
}

// Initialize charts when the page loads
document.addEventListener("DOMContentLoaded", () => {
    // Create charts with specified y-axis ranges
    charts.voltage = createChart("voltageChart", "Voltage (V)", 0, 250);
    charts.current = createChart("currentChart", "Current (A)", 2, 50);
    charts.power = createChart("powerChart", "Power (W)", 0, 12500);
    charts.frequency = createChart("frequencyChart", "Frequency (Hz)", 0, 50);
    charts.powerFactor = createChart("powerFactorChart", "Power Factor", 0, 1);
    charts.energy = createChart("energyChart", "Energy (kWh)", 0, 300);

    // Add event listener for the toggle switch
    document.getElementById("toggleSwitch").addEventListener("change", toggleSwitchHandler);

    // Fetch data and set an interval to keep updating
    setInterval(fetchData, updateInterval);
    fetchData();
});
