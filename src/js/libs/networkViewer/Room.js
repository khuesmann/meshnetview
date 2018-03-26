import Node from './Node.js';
export default class Room {
    /**
     *
     * @param scene
     * @param roomData
     * @param height
     * @param previousHeight
     * @param scale
     * @param floorLevel
     */
    constructor(scene, roomData, height, previousHeight, scale, floorLevel)
    {
        this.scene = scene;
        this.mesh = MeshFactory.getRoom(this.scene, roomData.name);
        this.nodes = [];
        this.floorLevel = floorLevel;
        this.roomData = roomData;
        this.previousHeight = previousHeight;
        this.scale = scale;
        this.nodeOffset = 0;

        // Scale bo to room to desired size
        this.mesh.scaling.x = roomData.grid.stop.x - roomData.grid.start.x;
        this.mesh.scaling.y = height;
        this.mesh.scaling.z = roomData.grid.stop.z - roomData.grid.start.z;

        this.mesh.scaling.x *= this.scale.x;
        this.mesh.scaling.y *= this.scale.y;
        this.mesh.scaling.z *= this.scale.z;

        // place the bottom left corner to desired coordinates
        NetworkViewerHelper.setToOrigin(this.mesh);

        this.mesh.position.x += roomData.grid.start.x * this.scale.x;
        this.mesh.position.z += roomData.grid.start.z * this.scale.z;
        this.mesh.position.y += previousHeight * this.scale.y;

        this.mesh.material = MeshFactory.getColoredMaterial(this.scene, roomData.name, roomData.color.r, roomData.color.g, roomData.color.b, roomData.color.a);

        document.body.addEventListener('reset-networkviewer', (event) => {
            this.nodes = [];
            this.nodeOffset = 0;
        });
    }

    /**
     *
     * @param nodesData
     */
    addNodes(nodesData) {
        nodesData = nodesData || [];

        let self = this;
        nodesData.forEach(function(node) {
            self.nodes.push(self.addNode(node));
        });
    }

    /**
     *
     * @param name
     * @param positionX
     * @param positionZ
     * @returns {Node}
     */
    addNode(name, positionX, positionZ) {
        if(this.nodes.length > 0) {
            this.nodeOffset += 0.8;
        }
        var position = { x: positionX, y: this.mesh.position.y + 1, z: positionZ }
        let node = new Node(this.scene, nodeData.name, nodeData.grid, nodeData.color, true);
        return node;
    }

    /**
     * hide all nodes
     */
    hideNodes() {
        this.nodes.forEach(function(node) {
            node.mesh.initialVisibility = node.mesh.visibility;
            node.mesh.visibility = false;
        })
    }

    /**
     * show nodes
     */
    showNodes() {
        this.nodes.forEach(function(node) {
            if(node.mesh.initialVisibility) {
                node.mesh.visibility = true;
            }
        })
    }
}