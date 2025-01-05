const apiKey = 'Z9I8A8CEOFKGXNNN';  // Replace with your ThingSpeak read API key
const channelId = '2800872'; // Replace with your ThingSpeak channel ID
const writeApiKey = 'IG4STQXCWCJ3L813'; // Replace with your ThingSpeak write API key
const updateInterval = 15000;

function sendToThingSpeak(value) {
    const url = https://api.thingspeak.com/update?api_key=${writeApiKey}&field7=${value};
    fetch(url).catch(error => console.error('Error sending data:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    const ledToggle = document.getElementById('led-toggle');
    const ledStatus = document.getElementById('led-status');

    ledToggle.addEventListener('change', () => {
        const state = ledToggle.checked ? 1 : 0;
        ledStatus.textContent = state ? 'ON' : 'OFF';
        sendToThingSpeak(state);
    });

    function fetchDataAndUpdateChart(chart, field) {
        fetch(https://api.thingspeak.com/channels/${channelId}/fields/${field}.json?api_key=${apiKey}&results=10)
            .then(response => response.json())
            .then(data => {
                const feed = data.feeds;
                const labels = feed.map(entry => new Date(entry.created_at).toLocaleTimeString());
                const values = feed.map(entry => parseFloat(entry[field${field}]) || 0);
                chart.data.labels = labels;
                chart.data.datasets[0].data = values;
                chart.update();
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    const voltageChart = new Chart(document.getElementById('voltage-chart').getContext('2d'), {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Voltage (V)', data: [], borderColor: 'blue', borderWidth: 2 }] },
        options: { 
            responsive: true, 
            scales: { 
                x: { title: { display: true, text: 'Time' }, grid: { display: true } },
                y: { title: { display: true, text: 'Voltage (V)' }, grid: { display: true } }
            },
            plugins: { title: { display: true, text: 'Voltage' } }
        }
    });

    const currentChart = new Chart(document.getElementById('current-chart').getContext('2d'), {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Current (A)', data: [], borderColor: 'green', borderWidth: 2 }] },
        options: { 
            responsive: true, 
            scales: { 
                x: { title: { display: true, text: 'Time' }, grid: { display: true } },
                y: { title: { display: true, text: 'Current (A)' }, grid: { display: true } }
            },
            plugins: { title: { display: true, text: 'Current' } }
        }
    });

    const powerChart = new Chart(document.getElementById('power-chart').getContext('2d'), {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Power (W)', data: [], borderColor: 'red', borderWidth: 2 }] },
        options: { 
            responsive: true, 
            scales: { 
                x: { title: { display: true, text: 'Time' }, grid: { display: true } },
                y: { title: { display: true, text: 'Power (W)' }, grid: { display: true } }
            },
            plugins: { title: { display: true, text: 'Power' } }
        }
    });

    const frequencyChart = new Chart(document.getElementById('frequency-chart').getContext('2d'), {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Frequency (Hz)', data: [], borderColor: 'orange', borderWidth: 2 }] },
        options: { 
            responsive: true, 
            scales: { 
                x: { title: { display: true, text: 'Time' }, grid: { display: true } },
                y: { title: { display: true, text: 'Frequency (Hz)' }, grid: { display: true } }
            },
            plugins: { title: { display: true, text: 'Frequency' } }
        }
    });

    const powerFactorChart = new Chart(document.getElementById('power-factor-chart').getContext('2d'), {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Power Factor', data: [], borderColor: 'purple', borderWidth: 2 }] },
        options: { 
            responsive: true, 
            scales: { 
                x: { title: { display: true, text: 'Time' }, grid: { display: true } },
                y: { title: { display: true, text: 'Power Factor' }, grid: { display: true } }
            },
            plugins: { title: { display: true, text: 'Power Factor' } }
        }
    });

    const energyChart = new Chart(document.getElementById('energy-chart').getContext('2d'), {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Energy (kWh)', data: [], borderColor: 'teal', borderWidth: 2 }] },
        options: { 
            responsive: true, 
            scales: { 
                x: { title: { display: true, text: 'Time' }, grid: { display: true } },
                y: { title: { display: true, text: 'Energy (kWh)' }, grid: { display: true } }
            },
            plugins: { title: { display: true, text: 'Energy' } }
        }
    });

    setInterval(() => {
        fetchDataAndUpdateChart(voltageChart, 1);
        fetchDataAndUpdateChart(currentChart, 2);
        fetchDataAndUpdateChart(powerChart, 3);
        fetchDataAndUpdateChart(frequencyChart, 4);
        fetchDataAndUpdateChart(powerFactorChart, 5);
        fetchDataAndUpdateChart(energyChart, 6);
    }, updateInterval);
});
