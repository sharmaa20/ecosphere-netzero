class PredictiveMaintenance {
    constructor() {
        this.equipmentData = {};
        this.alerts = [];
        this.model = null;
        
        this.init();
    }
    
    async init() {
        await this.loadEquipmentData();
        this.initModel();
        this.initCharts();
        this.startMonitoring();
    }
    
    async loadEquipmentData() {
        try {
            // Simulate API call with mock data
            this.equipmentData = await this.fetchMockEquipmentData();
            console.log('Equipment data loaded');
        } catch (error) {
            console.error('Error loading equipment data:', error);
        }
    }
    
    fetchMockEquipmentData() {
        return new Promise((resolve) => {
            // Generate mock equipment data
            const equipment = [
                { id: 'hvac-1', name: 'HVAC Unit 1', type: 'hvac', age: 3, lastService: '2023-01-15', status: 'normal' },
                { id: 'hvac-2', name: 'HVAC Unit 2', type: 'hvac', age: 5, lastService: '2022-11-20', status: 'warning' },
                { id: 'chiller-1', name: 'Chiller Plant', type: 'cooling', age: 8, lastService: '2022-09-10', status: 'critical' },
                { id: 'ahu-1', name: 'Air Handler 1', type: 'hvac', age: 2, lastService: '2023-03-05', status: 'normal' },
                { id: 'pump-1', name: 'Cooling Pump', type: 'cooling', age: 4, lastService: '2022-12-18', status: 'warning' },
                { id: 'rtu-1', name: 'Roof Top Unit', type: 'hvac', age: 7, lastService: '2022-08-22', status: 'warning' },
                { id: 'boiler-1', name: 'Boiler System', type: 'heating', age: 10, lastService: '2022-05-30', status: 'critical' }
            ];
            
            // Generate sensor readings
            equipment.forEach(item => {
                item.sensors = this.generateSensorData(item);
                item.healthScore = this.calculateHealthScore(item);
            });
            
            setTimeout(() => resolve(equipment), 500);
        });
    }
    
    generateSensorData(equipment) {
        const baseValues = {
            hvac: { vibration: 2, temp: 22, pressure: 120 },
            cooling: { vibration: 1.5, temp: 15, pressure: 80 },
            heating: { vibration: 3, temp: 65, pressure: 150 }
        };
        
        const base = baseValues[equipment.type] || baseValues.hvac;
        const ageFactor = equipment.age / 10;
        const statusFactor = equipment.status === 'critical' ? 1.5 : equipment.status === 'warning' ? 1.2 : 1;
        
        return {
            vibration: (base.vibration * (1 + ageFactor * 0.5) * statusFactor).toFixed(2),
            temperature: (base.temp * (1 + ageFactor * 0.3) * statusFactor).toFixed(1),
            pressure: (base.pressure * (1 + ageFactor * 0.2) * statusFactor).toFixed(1),
            power: (100 * (1 + ageFactor * 0.4) * statusFactor).toFixed(1)
        };
    }
    
    calculateHealthScore(equipment) {
        // Lower score is better
        let score = equipment.age * 5;
        
        if (equipment.status === 'warning') score += 30;
        if (equipment.status === 'critical') score += 60;
        
        // Add random variation
        score += Math.random() * 20;
        
        // Convert to 0-100 scale (higher is better)
        return Math.max(0, 100 - score);
    }
    
    initModel() {
        // In a real implementation, this would load a pre-trained model
        console.log('Initializing predictive maintenance model');
        
        // Mock model for demonstration
        this.model = {
            predict: (equipment) => {
                // Generate mock failure prediction
                const daysSinceService = Math.floor((new Date() - new Date(equipment.lastService)) / (1000 * 60 * 60 * 24));
                const baseRisk = equipment.age * 0.02 + daysSinceService * 0.001;
                
                let failureProbability = baseRisk;
                if (equipment.status === 'warning') failureProbability += 0.3;
                if (equipment.status === 'critical') failureProbability += 0.6;
                
                // Add some randomness
                failureProbability = Math.min(0.95, failureProbability + Math.random() * 0.1);
                
                // Predict time to failure (days)
                const timeToFailure = 30 + (1 - failureProbability) * 180;
                
                return {
                    failureProbability: failureProbability * 100,
                    timeToFailure: timeToFailure,
                    recommendation: this.generateRecommendation(equipment, failureProbability)
                };
            }
        };
    }
    
    generateRecommendation(equipment, failureProbability) {
        if (failureProbability > 0.7) {
            return 'Immediate service required';
        } else if (failureProbability > 0.5) {
            return 'Schedule service within 1 week';
        } else if (failureProbability > 0.3) {
            return 'Schedule service within 1 month';
        } else if (equipment.age > 5) {
            return 'Routine maintenance recommended';
        } else {
            return 'No immediate action needed';
        }
    }
    
    initCharts() {
        if (!document.getElementById('equipment-health-chart')) return;
        
        // Equipment Health Chart
        const ctx = document.getElementById('equipment-health-chart').getContext('2d');
        this.healthChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.equipmentData.map(e => e.name),
                datasets: [{
                    label: 'Health Score',
                    data: this.equipmentData.map(e => e.healthScore),
                    backgroundColor: this.equipmentData.map(e => 
                        e.healthScore > 75 ? '#2ecc71' : 
                        e.healthScore > 50 ? '#f39c12' : '#e74c3c'
                    ),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Equipment Health Status'
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: (context) => {
                                const equipment = this.equipmentData[context.dataIndex];
                                return [
                                    `Type: ${equipment.type}`,
                                    `Age: ${equipment.age} years`,
                                    `Last Service: ${equipment.lastService}`,
                                    `Status: ${equipment.status.toUpperCase()}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Health Score'
                        }
                    }
                }
            }
        });
        
        // Failure Probability Chart
        this.initFailureProbabilityChart();
        
        // Populate equipment table
        this.populateEquipmentTable();
    }
    
    initFailureProbabilityChart() {
        const ctx = document.getElementById('failure-probability-chart').getContext('2d');
        
        // Generate predictions for all equipment
        const predictions = this.equipmentData.map(e => this.model.predict(e));
        
        this.failureChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: this.equipmentData.map(e => e.name),
                datasets: [{
                    label: 'Failure Probability',
                    data: predictions.map(p => p.failureProbability),
                    backgroundColor: 'rgba(231, 76, 60, 0.2)',
                    borderColor: '#e74c3c',
                    pointBackgroundColor: '#e74c3c',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#e74c3c'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Equipment Failure Risk Assessment'
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: (context) => {
                                const pred = predictions[context.dataIndex];
                                return [
                                    `Time to failure: ${pred.timeToFailure.toFixed(1)} days`,
                                    `Recommendation: ${pred.recommendation}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    }
    
    populateEquipmentTable() {
        const tableBody = document.getElementById('equipment-table-body');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        this.equipmentData.forEach(equipment => {
            const prediction = this.model.predict(equipment);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${equipment.name}</td>
                <td>${equipment.type.toUpperCase()}</td>
                <td>${equipment.age} years</td>
                <td>${equipment.lastService}</td>
                <td><span class="status-badge ${equipment.status}">${equipment.status.toUpperCase()}</span></td>
                <td>${equipment.healthScore.toFixed(1)}</td>
                <td>${prediction.failureProbability.toFixed(1)}%</td>
                <td>${prediction.timeToFailure.toFixed(1)} days</td>
                <td>${prediction.recommendation}</td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    startMonitoring() {
        // Simulate real-time monitoring
        this.monitoringInterval = setInterval(() => {
            this.checkForAlerts();
        }, 10000);
    }
    
    checkForAlerts() {
        // Check each piece of equipment for issues
        this.equipmentData.forEach(equipment => {
            const prediction = this.model.predict(equipment);
            
            if (prediction.failureProbability > 70 && !this.alerts.includes(equipment.id)) {
                this.createAlert(equipment, prediction);
            }
        });
        
        // Update alerts panel
        this.updateAlertsPanel();
    }
    
    createAlert(equipment, prediction) {
        const alert = {
            id: Date.now(),
            equipmentId: equipment.id,
            equipmentName: equipment.name,
            severity: prediction.failureProbability > 80 ? 'critical' : 'warning',
            message: `High failure risk (${prediction.failureProbability.toFixed(1)}%) detected for ${equipment.name}`,
            recommendation: prediction.recommendation,
            timestamp: new Date().toISOString(),
            acknowledged: false
        };
        
        this.alerts.push(alert);
    }
    
    updateAlertsPanel() {
        const alertsContainer = document.getElementById('alerts-container');
        if (!alertsContainer) return;
        
        alertsContainer.innerHTML = '';
        
        if (this.alerts.length === 0) {
            alertsContainer.innerHTML = '<div class="no-alerts">No active alerts</div>';
            return;
        }
        
        // Sort alerts by severity and timestamp
        const sortedAlerts = [...this.alerts].sort((a, b) => {
            if (a.severity === b.severity) {
                return new Date(b.timestamp) - new Date(a.timestamp);
            }
            return a.severity === 'critical' ? -1 : 1;
        });
        
        sortedAlerts.forEach(alert => {
            const alertElement = document.createElement('div');
            alertElement.className = `alert ${alert.severity} ${alert.acknowledged ? 'acknowledged' : ''}`;
            alertElement.innerHTML = `
                <div class="alert-header">
                    <span class="alert-title">${alert.message}</span>
                    <span class="alert-time">${new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="alert-body">
                    <p><strong>Equipment:</strong> ${alert.equipmentName}</p>
                    <p><strong>Recommendation:</strong> ${alert.recommendation}</p>
                </div>
                <div class="alert-actions">
                    <button class="acknowledge-btn" data-alert-id="${alert.id}">
                        ${alert.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                    </button>
                    <button class="details-btn">View Details</button>
                </div>
            `;
            
            alertsContainer.appendChild(alertElement);
        });
        
        // Add event listeners for acknowledge buttons
        document.querySelectorAll('.acknowledge-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const alertId = parseInt(e.target.dataset.alertId);
                this.acknowledgeAlert(alertId);
            });
        });
    }
    
    acknowledgeAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.acknowledged = true;
            this.updateAlertsPanel();
        }
    }
}

// Initialize when maintenance page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('equipment-health-chart')) {
        const maintenance = new PredictiveMaintenance();
    }
});