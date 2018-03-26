import BABYLON from 'babylonjs';
function Node_backup(scene, nodeName, nodeGrid, scale, nodeColor, roomGrid, previousHeight) {

    nodeColor = nodeColor || {r: 1, g: 0, b: 0};
    roomGrid = roomGrid || {x: 0, y: 0, z: 0};
    previousHeight = previousHeight || 0;
    
    this.scene = scene;
    this.mesh = MeshFactory.getNode(this.scene, nodeName);
    this.scale = scale;

    this.mesh.position.x = (roomGrid.start.x + nodeGrid.x) * scale.x;
    this.mesh.position.y = (nodeGrid.y + previousHeight) * scale.y;
    this.mesh.position.z = ( - roomGrid.start.z - nodeGrid.z) * scale.z;
    this.mesh.material = MeshFactory.getColoredMaterial(this.scene, nodeName, nodeColor.r, nodeColor.g, nodeColor.b, nodeColor.a);
    this.mesh.id = viewerOptions.nodePrefix + nodeName;
    this.mesh.label = this.addText(nodeName, "red");
}

Node.prototype.addText = function addText(text, color) {
    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture" + text, 100, this.scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, "bold 22px Arial", color, "transparent", true);
    var plane = new BABYLON.Mesh.CreatePlane("TextPlane_" + text, 4, this.scene, true);
    plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", this.scene);
    plane.material.backFaceCulling = false;
    plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
    plane.material.diffuseTexture = dynamicTexture;
    plane.position = new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y + 0.2, this.mesh.position.z);
    
    return plane;
};

module.exports = Node;