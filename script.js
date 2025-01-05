document.addEventListener('DOMContentLoaded', () => {
    const ledToggle = document.getElementById('led-toggle');
    const ledStatus = document.getElementById('led-status');
    const scheduleTime = document.getElementById('schedule-time');
    const scheduleBtn = document.getElementById('schedule-btn');

    ledToggle.addEventListener('change', () => {
        if (ledToggle.checked) {
            ledStatus.textContent = 'ON';
            ledStatus.style.backgroundColor = 'green';
        } else {
            ledStatus.textContent = 'OFF';
            ledStatus.style.backgroundColor = 'white';
        }
        // Send toggle status to ThingSpeak
    });

    scheduleBtn.addEventListener('click', () => {
        const time = scheduleTime.value;
        if (time) {
            alert(LED will be scheduled to turn on at ${time});
            // Send scheduled time to ThingSpeak
        }
    });

    // Chart.js setup (replace data fetching and updating with ThingSpeak API requests)
    const charts = [
        { id: 'voltage-chart', label: 'Voltage (V)' },
        { id: 'current-chart', label: 'Current (A)' },
        { id: 'power-chart', label: 'Power (W)' },
        { id: 'frequency-chart', label: 'Frequency (Hz)' },
        { id: 'power-factor-chart', label: 'Power Factor' },
        { id: 'energy-chart', label: 'Energy (kWh)' }
    ];

    charts.forEach(chart => {
        const ctx = document.getElementById(chart.id).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: [], // Time data
                datasets: [{
                    label: chart.label,
                    data: [], // Sensor data
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Time' } },
                    y: { title: { display: true, text: chart.label } }
                }
            }
        });
    });
});
