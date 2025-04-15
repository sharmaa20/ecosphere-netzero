import { BuildingViewer } from './threeDViewer.js';

// Main Application Controller
class BuildingNexusApp {
    constructor() {
        this.currentBuilding = 'bldg1';
        this.currentView = 'dashboard';
        this.initEventListeners();
        this.loadCurrentView();
                // Add Net Zero menu item
                this.addNetZeroMenuItem();
        
                // Initialize Net Zero components if on that page
                if (window.location.pathname.includes('net-zero')) {
                    this.initNetZeroComponents();
                }
    }
    
    addNetZeroMenuItem() {
        const navMenu = document.querySelector('.nav-menu');
        const netZeroItem = document.createElement('li');
        netZeroItem.innerHTML = `
            <a href="net-zero.html"><i class="fas fa-leaf"></i> Net Zero</a>
        `;
        navMenu.appendChild(netZeroItem);
    }
    
    initNetZeroComponents() {
        this.netZeroOptimizer = new NetZeroOptimizer();
        this.netZeroDashboard = new NetZeroDashboard();
        
        // Connect optimizer to dashboard
        this.netZeroOptimizer.onUpdate = (data) => {
            this.netZeroDashboard.updateMetrics(data);
        };
        
        // Initialize with current data
        this.netZeroOptimizer.runOptimizationCycle();
    }
    
    initEventListeners() {
        // Navigation menu clicks
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = link.getAttribute('href').replace('.html', '');
                this.navigateTo(view);
            });
        });
        
        // Building selector change
        const buildingSelect = document.getElementById('building-select');
        if (buildingSelect) {
            buildingSelect.addEventListener('change', (e) => {
                this.currentBuilding = e.target.value;
                this.updateBuildingData();
            });
        }
        
        // Time range buttons
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateTimeRange(e.target.dataset.range);
            });
        });
    }
    
    navigateTo(view) {
        this.currentView = view;
        window.history.pushState({}, '', `${view}.html`);
        this.loadCurrentView();
    }
    
    // In main.js
    loadCurrentView() {
        const titleElement = document.getElementById('page-title');
        if (titleElement) {
            const titleMap = {
                'dashboard': 'Building Energy Intelligence Dashboard',
                'building-explorer': '3D Building Explorer'
            };
            titleElement.textContent = titleMap[this.currentView] || 'Smart Building Nexus';
        }
    }
    
    updateBuildingData() {
        console.log(`Building changed to: ${this.currentBuilding}`);
        // In a real app, this would fetch new data for the selected building
        // and update all visualizations
    }
    
    updateTimeRange(range) {
        console.log(`Time range changed to: ${range}`);
        // In a real app, this would update all data visualizations
        // to show data for the selected time range
    }

    
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const viewer = new BuildingViewer('building-model-container');
});

// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const app = new BuildingNexusApp();
    
    // Remove any existing model loading code
    // The viewer now creates its own procedural model
});