import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/controls/OrbitControls.js';

class BuildingViewer {
    constructor(containerId) {
        // 1. Initialize Three.js
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        // 2. Add lights
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0x404040));

        // 3. Create building
        this.createBuilding();

        // 4. Set camera position
        this.camera.position.z = 50;
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // 5. Start animation
        this.animate();
    }


    createBuilding() {
        // Main building group
        this.building = new THREE.Group();
        
        // Base structure (5 floors)
        const buildingGeometry = new THREE.BoxGeometry(30, 20, 40);
        const buildingMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            transparent: true,
            opacity: 0.9
        });
        const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
        buildingMesh.position.y = 10;
        buildingMesh.castShadow = true;
        buildingMesh.receiveShadow = true;
        this.building.add(buildingMesh);

        // Add floors
        for (let i = 1; i <= 5; i++) {
            const floor = new THREE.Mesh(
                new THREE.BoxGeometry(31, 0.2, 41),
                new THREE.MeshStandardMaterial({ color: 0x888888 })
            );
            floor.position.y = 4 * i;
            this.building.add(floor);
        }

        // Add zones (Office, Lab, Common)
        this.addZone("Office", 0x4477aa, -10, 0.1, -15, 12, 0.1, 10);
        this.addZone("Lab", 0xaa4444, 10, 0.1, -15, 12, 0.1, 10);
        this.addZone("Common", 0x44aa44, 0, 0.1, 15, 20, 0.1, 15);

        // Add solar panels
        this.addSolarPanels();

        // Add to scene
        this.scene.add(this.building);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
    }
    

    addZone(name, color, x, y, z, width, height, depth) {
        const zoneGeometry = new THREE.BoxGeometry(width, height, depth);
        const zoneMaterial = new THREE.MeshStandardMaterial({
            color: color,
            transparent: true,
            opacity: 0.6
        });
        const zoneMesh = new THREE.Mesh(zoneGeometry, zoneMaterial);
        zoneMesh.position.set(x, y, z);
        
        // Add metadata for interaction
        zoneMesh.userData = {
            type: "zone",
            name: name,
            clickable: true,
            energyUsage: Math.random() * 5 + 3 // kWh/m²
        };
        
        this.building.add(zoneMesh);
    }

    addSolarPanels() {
        const solarGroup = new THREE.Group();
        
        for (let x = -12; x <= 12; x += 6) {
            for (let z = -18; z <= 18; z += 6) {
                const panel = new THREE.Mesh(
                    new THREE.BoxGeometry(4, 0.1, 2),
                    new THREE.MeshStandardMaterial({
                        color: 0x333333,
                        metalness: 0.9,
                        roughness: 0.1
                    })
                );
                panel.position.set(x, 20.1, z);
                panel.rotation.x = Math.PI / 4;
                panel.userData = {
                    type: "solarPanel",
                    capacity: 0.3 // kW
                };
                solarGroup.add(panel);
            }
        }
        
        this.building.add(solarGroup);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
    }

    setupInteractivity() {
        // Raycaster for mouse interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Event listeners
        this.renderer.domElement.addEventListener('click', (event) => {
            this.onClick(event);
        }, false);
    }

    onClick(event) {
        // Calculate mouse position
        this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
        
        // Raycast
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.building.children, true);
        
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            this.handleObjectClick(clickedObject);
        }
    }

    handleObjectClick(object) {
        // Find the parent with userData if this object doesn't have it
        let target = object;
        while (target && !target.userData.clickable && target.parent) {
            target = target.parent;
        }
        
        if (target.userData.clickable) {
            console.log("Clicked:", target.userData);
            this.showObjectInfo(target);
        }
    }

    showObjectInfo(object) {
        // Remove any existing info box
        const existingInfo = document.getElementById('object-info');
        if (existingInfo) existingInfo.remove();
        
        // Create info box
        const infoBox = document.createElement('div');
        infoBox.id = 'object-info';
        infoBox.style.position = 'absolute';
        infoBox.style.backgroundColor = 'white';
        infoBox.style.padding = '10px';
        infoBox.style.borderRadius = '5px';
        infoBox.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        
        // Position near the mouse
        infoBox.style.left = `${this.mouse.x * this.renderer.domElement.clientWidth/2 + this.renderer.domElement.clientWidth/2}px`;
        infoBox.style.top = `${-this.mouse.y * this.renderer.domElement.clientHeight/2 + this.renderer.domElement.clientHeight/2}px`;
        
        // Add content based on object type
        if (object.userData.type === 'zone') {
            infoBox.innerHTML = `
                <h3>${object.userData.name} Zone</h3>
                <p>Energy Usage: ${object.userData.energyUsage.toFixed(2)} kWh/m²</p>
            `;
        } else if (object.userData.type === 'solarPanel') {
            infoBox.innerHTML = `
                <h3>Solar Panel</h3>
                <p>Capacity: ${object.userData.capacity} kW</p>
            `;
        }
        
        document.body.appendChild(infoBox);
    }
}

export { BuildingViewer };  // Export the class


