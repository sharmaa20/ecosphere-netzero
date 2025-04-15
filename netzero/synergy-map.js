class SynergyMap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        
        // Create SVG canvas
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);
            
        // Define system nodes
        this.systems = [
            { id: 'solar', name: 'Solar', x: 100, y: 50 },
            { id: 'battery', name: 'Battery', x: 250, y: 50 },
            { id: 'acmv', name: 'ACMV', x: 100, y: 150 },
            { id: 'lighting', name: 'Lighting', x: 250, y: 150 },
            { id: 'water', name: 'Water', x: 175, y: 250 }
        ];
        
        // Draw initial map
        this.drawBaseMap();
    }
    
    drawBaseMap() {
        // Draw connections
        this.svg.selectAll('.connection')
            .data([
                { source: 'solar', target: 'battery', value: 0 },
                { source: 'solar', target: 'acmv', value: 0 },
                { source: 'solar', target: 'lighting', value: 0 },
                { source: 'battery', target: 'acmv', value: 0 },
                { source: 'battery', target: 'lighting', value: 0 },
                { source: 'acmv', target: 'water', value: 0 }
            ])
            .enter()
            .append('path')
            .attr('class', 'connection')
            .attr('stroke', '#ddd')
            .attr('stroke-width', 2);
            
        // Draw system nodes
        this.svg.selectAll('.system-node')
            .data(this.systems)
            .enter()
            .append('circle')
            .attr('class', 'system-node')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 30)
            .attr('fill', '#3498db');
            
        // Add system labels
        this.svg.selectAll('.system-label')
            .data(this.systems)
            .enter()
            .append('text')
            .attr('class', 'system-label')
            .attr('x', d => d.x)
            .attr('y', d => d.y + 5)
            .attr('text-anchor', 'middle')
            .text(d => d.name)
            .attr('fill', 'white');
    }
    
    update(data) {
        // Update connection strengths
        this.svg.selectAll('.connection')
            .attr('stroke', d => {
                const value = data[d.source] && data[d.target] ? 
                    this.calculateFlow(d.source, d.target, data) : 0;
                return this.getConnectionColor(value);
            })
            .attr('stroke-width', d => {
                const value = data[d.source] && data[d.target] ? 
                    this.calculateFlow(d.source, d.target, data) : 0;
                return this.getConnectionWidth(value);
            });
            
        // Update node colors based on status
        this.svg.selectAll('.system-node')
            .attr('fill', d => {
                return this.getSystemColor(d.id, data[d.id]);
            });
    }
    
    calculateFlow(source, target, data) {
        // Simplified flow calculation
        if (source === 'solar' && target === 'battery') {
            return data.solar.exportToBattery;
        }
        if (source === 'solar' && target === 'acmv') {
            return data.solar.directUsage * 0.4;
        }
        // Add other flow calculations...
        return 0;
    }
    
    getConnectionColor(value) {
        // Green (positive) to Red (negative) based on energy flow
        const intensity = Math.min(Math.abs(value) / 10, 1);
        if (value >= 0) {
            return d3.interpolateGreens(intensity);
        } else {
            return d3.interpolateReds(intensity);
        }
    }
    
    getConnectionWidth(value) {
        return 1 + Math.min(Math.abs(value) / 5, 5);
    }
    
    getSystemColor(systemId, status) {
        const statusColors = {
            active: '#2ecc71',
            idle: '#f39c12',
            disabled: '#e74c3c',
            charging: '#3498db',
            discharging: '#9b59b6'
        };
        return statusColors[status.state] || '#95a5a6';
    }
}