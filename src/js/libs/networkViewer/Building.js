import BABYLON from 'babylonjs';

import Floor from './Floor.js';

export default class Building {
    /**
     *
     * @param scene
     * @param buildingData
     */
    constructor(scene, buildingData)
    {
        this.scene = scene;
        this.floors = {};
        this.nodes = {};
        this.buildingData = buildingData;
        this.addFloors();
    }

    /**
     * add all floors
     */
    addFloors() {
        let self = this;
        let previousHeight = 0;
        for(var i = 0; i < this.buildingData.floors.length; i++) {
            var floor = this.buildingData.floors[i];
            self.floors[floor.level] = new Floor(self.scene, floor, previousHeight, self.buildingData.scale, {lat: self.buildingData.latitude, long: self.buildingData.longitude}, this.gpsRotation());
            previousHeight += self.floors[floor.level].height;
        }
    }

    /**
     * get all nodes
     */
    getNodes() {
        let self = this;
        for(let floorName in this.floors) {
            if(!this.floors.hasOwnProperty(floorName)) continue;
            this.floors[floorName]['rooms'].forEach(function(room) {
                room['nodes'].forEach(function(node) {
                    self.nodes[node.id] = node;
                })
            });
        }
    }

    /**
     * get room by name
     * @param roomName
     * @returns {*}
     */
    getRoomByName(roomName) {
        roomName = viewerOptions.roomPrefix + roomName;
        for(let floorIndex in this.floors) {
            if(!this.floors.hasOwnProperty(floorIndex)) continue;
            let floor = this.floors[floorIndex];
            for(let roomIndex = 0; roomIndex < floor.rooms.length ; roomIndex++) {
                let room = floor.rooms[roomIndex];
                if(room.mesh.name == roomName) return room;
            }
        }
    }

    /**
     * get gps rotation
     * @returns {*}
     */
    gpsRotation() {
        let rotation = NetworkViewerHelper.getGPSRotation(this.buildingData.latitude, this.buildingData.longitude, this.buildingData.latitude2, this.buildingData.longitude2);
        return rotation;
        for(let level in this.floors) {
            if(!this.floors.hasOwnProperty(level)) continue;
            this.floors[level].rooms.forEach((room) => {
                room.mesh.rotation.y = 1;
            });
        }
    }

    scale() {

    }

    /**
     * get single floor
     * @param floorLevel
     * @returns {*}
     */
    getFloor(floorLevel) {
        return this.floors[floorLevel]
    }

    /**
     * toggle floor
     * @param floorName
     */
    toggleFloor(floorName) {
        let floor = this.floors[floorName] || false;
        if(floor) {
            floor.toggle();
        }
    }
}