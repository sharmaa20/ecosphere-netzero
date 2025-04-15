class NetZeroDashboard {
    constructor() {
        this.metrics = {
            energyBalance: 0,  // kWh
            carbonOffset: 0,   // kgCO2e
            waterSaved: 0,     // liters
            passiveHours: 0    // hours
        };
        
        this.initDashboard();
    }
    
    initDashboard() {
        // Create dashboard DOM elements
        this.container = document.createElement('div');
        this.container.className = 'net-zero-dashboard';
        
        this.container.innerHTML = `
            <div class="dashboard-header">
                <h2>Net Zero Performance</h2>
                <div class="time-selector">
                    <button class="time-btn active">Today</button>
                    <button class="time-btn">Week</button>
                    <button class="time-btn">Month</button>
                </div>
            </div>
            <div class="metrics-grid">
                <div class="metric-card" id="energy-balance">
                    <h3>Energy Balance</h3>
                    <div class="metric-value">0 kWh</div>
                    <div class="metric-trend neutral">
                        <i class="fas fa-equals"></i> Net Zero
                    </div>
                </div>
                <div class="metric-card" id="carbon-offset">
                    <h3>Carbon Offset</h3>
                    <div class="metric-value">0 kgCO₂e</div>
                    <div class="metric-trend positive">
                        <i class="fas fa-arrow-up"></i> 0%
                    </div>
                </div>
                <div class="metric-card" id="water-saved">
                    <h3>Water Saved</h3>
                    <div class="metric-value">0 L</div>
                    <div class="metric-trend positive">
                        <i class="fas fa-arrow-up"></i> 0%
                    </div>
                </div>
                <div class="metric-card" id="passive-hours">
                    <h3>Passive Cooling</h3>
                    <div class="metric-value">0 h</div>
                    <div class="metric-trend neutral">
                        <i class="fas fa-equals"></i> 0%
                    </div>
                </div>
            </div>
            <div class="synergy-visualization">
                <h3>System Synergy Map</h3>
                <div class="synergy-map" id="synergy-map"></div>
            </div>
        `;
        
        document.getElementById('dynamic-content').appendChild(this.container);
        this.initSynergyMap();
    }
    
    updateMetrics(data) {
        this.metrics = data;
        
        // Update energy balance
        const energyElement = document.querySelector('#energy-balance .metric-value');
        energyElement.textContent = `${data.energyBalance.toFixed(1)} kWh`;
        
        // Update carbon offset
        const carbonElement = document.querySelector('#carbon-offset .metric-value');
        carbonElement.textContent = `${data.carbonOffset.toFixed(1)} kgCO₂e`;
        
        // Update visualizations
        this.updateSynergyMap(data.systemStatus);
    }
    
    initSynergyMap() {
        // Initialize visualization of system interactions
        this.synergyMap = new SynergyMap('synergy-map');
    }
    
    updateSynergyMap(systemStatus) {
        // Update the visualization with current system states
        this.synergyMap.update({
            solar: systemStatus.solar,
            battery: systemStatus.battery,
            acmv: systemStatus.acmv,
            water: systemStatus.water,
            lighting: systemStatus.lighting
        });
    }
}