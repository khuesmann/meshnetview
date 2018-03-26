import Room from './Room.js';

export default class Floor {
    /**
     *
     * @param scene
     * @param floorData
     * @param previousHeight
     * @param scale
     * @param buildingGPS
     * @param rotation
     */
    constructor(scene, floorData, previousHeight, scale, buildingGPS, rotation)
    {
        let self = this;
        this.scene = scene;
        this.floorData = floorData;
        this.height = floorData.height;
        this.previousHeight = previousHeight;
        this.level = floorData.level;
        this.rooms = [];
        this.nodes = {};
        this.roomsMesh = null;
        this.scale = scale;
        this.buildingGPS = buildingGPS;
        this.rotation = rotation;
        this.createRooms(floorData);
    }

    /**
     * create rooms
     * @param floorData
     */
    createRooms(floorData) {
        let self = this;
        let floorRooms = [];
        floorData.rooms.forEach(function (roomData) {
            let room = self.createRoom(roomData);
            self.rooms.push(room);
            floorRooms.push(room.mesh);
        });

        // merge the room meshes for performance
        this.roomsMesh = BABYLON.Mesh.MergeMeshes(floorRooms, true);
        this.roomsMesh.id = viewerOptions.floorPrefix + this.floorData.name;

        // rotate floor and translate by given GPS Coordinates
        let gpsToXZ = GPSHelper.gpsToXZ(this.buildingGPS.lat, this.buildingGPS.long);
        this.roomsMesh.translate(new BABYLON.Vector3(gpsToXZ.x, 0, gpsToXZ.z), 1, BABYLON.Space.LOCAL);
        this.roomsMesh.rotate(new BABYLON.Vector3(0,1,0), this.rotation, BABYLON.Space.LOCAL)
    }

    /**
     * create single room
     * @param roomData
     * @returns {Room}
     */
    createRoom(roomData) {
        let room = new Room(this.scene, roomData, this.height, this.previousHeight, this.scale, this.level);
        return room;
    }

    /**
     * toggle room
     */
    toggle() {
        let self = this;
        let isVisible = ! this.roomsMesh.visibility;
        this.roomsMesh.visibility = isVisible;

        if(! isVisible) {
            this.rooms.forEach(function(room) {
                room.hideNodes();
            });
        }
        else {
            this.rooms.forEach(function(room) {
                room.showNodes();
            });
        }
    }
}