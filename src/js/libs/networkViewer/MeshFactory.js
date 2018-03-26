export default class MeshFactory {

    constructor() {
        this.room = null;
        this.node = null;
        this.tube = null;
        this.materials = {};
    }

    getRoom(scene, id) {
        if(this.room == null)
        {
            this.room = BABYLON.Mesh.CreateBox(viewerOptions.roomPrefix + id, 1.0, scene, false, BABYLON.Mesh.DEFAULTSIDE);
            this.room.visibility = false;
        }
        let newRoom = this.room.clone(viewerOptions.roomPrefix + id);
        newRoom.name = viewerOptions.roomPrefix + id;
        newRoom.id = viewerOptions.roomPrefix + id;
        newRoom.visibility = true;
        return newRoom;
    }

    getTube(scene, name, bezierPoints, width) {
        if(this.tube == null) {
            this.tube = BABYLON.Mesh.CreateTube(name, bezierPoints, width, 6, null, null, scene);
        }
        this.tube.pathArray = bezierPoints;
        let newTube = this.tube.clone(name);
        newTube.name = name;
        newTube.id = name;
        newTube.visibility = true;
        return newTube;
    }

    getNode(scene, id) {
        if(this.node == null)
        {
            this.node = BABYLON.Mesh.CreateSphere(viewerOptions.nodePrefix + id, 7, 1, scene);
            this.node.visibility = false;
        }
        let newNode = this.node.clone(viewerOptions.nodePrefix + id);
        newNode.visibility = true;

        return newNode;
    }

    getColoredMaterial(scene,id,r,g,b,a) {

        let materialKey = String(r) + "_" + String(g) + "_" + String(b) + "_" + String(a);
        if(this.materials[materialKey]) return this.materials[materialKey];

        r = r > 1 ? r / 255 : r;
        g = g > 1 ? g / 255 : g;
        b = b > 1 ? b / 255 : b;

        let material = new BABYLON.StandardMaterial(viewerOptions.materialPrefix + id, scene);
        material.diffuseColor = new BABYLON.Color3(r, g, b);
        material.specularColor = new BABYLON.Color3(r, g, b);
        material.alpha = a;
        this.materials[materialKey] = material;

        return material;
    }
}