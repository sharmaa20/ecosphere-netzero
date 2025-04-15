// js/procedural-building.js
import * as THREE from 'three';

export function createProceduralBuilding() {
    const building = new THREE.Group();
    building.name = "NetZeroBuilding";

    // 1. Main Structure
    const mainGeometry = new THREE.BoxGeometry(40, 20, 60);
    const mainMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xcccccc,
        transparent: true,
        opacity: 0.8
    });
    const mainBuilding = new THREE.Mesh(mainGeometry, mainMaterial);
    mainBuilding.position.y = 10;
    mainBuilding.castShadow = true;
    mainBuilding.userData = {
        type: "building",
        carbonFootprint: 12000 // kgCO2e
    };
    building.add(mainBuilding);

    // 2. Floors (5 levels)
    for (let i = 1; i <= 5; i++) {
        const floor = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.BoxGeometry(41, 0.2, 61)),
            new THREE.LineBasicMaterial({ color: 0x555555 })
        );
        floor.position.y = 4 * i;
        building.add(floor);
    }

    // 3. Zones (Office/Lab/Common)
    const zones = [
        { name: "Office", color: 0x4477aa, position: [-15, 0.1, -20], size: [20, 0.1, 15] },
        { name: "Lab", color: 0xaa4444, position: [15, 0.1, -20], size: [20, 0.1, 15] },
        { name: "Common", color: 0x44aa44, position: [0, 0.1, 20], size: [30, 0.1, 20] }
    ];

    zones.forEach(zone => {
        const zoneMesh = new THREE.Mesh(
            new THREE.BoxGeometry(...zone.size),
            new THREE.MeshStandardMaterial({ 
                color: zone.color,
                transparent: true,
                opacity: 0.5
            })
        );
        zoneMesh.position.set(...zone.position);
        zoneMesh.userData = {
            type: "zone",
            name: zone.name,
            energyUsage: Math.random() * 10 + 5 // kWh/m²
        };
        building.add(zoneMesh);
    });

    // 4. Solar Panels
    const solarPanels = new THREE.Group();
    for (let x = -18; x <= 18; x += 6) {
        for (let z = -28; z <= 28; z += 6) {
            const panel = new THREE.Mesh(
                new THREE.BoxGeometry(5, 0.1, 3),
                new THREE.MeshStandardMaterial({ 
                    color: 0x333333,
                    metalness: 0.9
                })
            );
            panel.position.set(x, 20.1, z);
            panel.rotation.x = Math.PI / 4;
            panel.userData = {
                type: "solar",
                capacity: 0.3 // kW
            };
            solarPanels.add(panel);
        }
    }
    building.add(solarPanels);

    // 5. HVAC System
    const hvacUnit = new THREE.Mesh(
        new THREE.CylinderGeometry(2, 2, 1.5, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    hvacUnit.position.set(0, 21, 0);
    hvacUnit.userData = {
        type: "hvac",
        efficiency: 0.82
    };
    building.add(hvacUnit);

    return building;
}