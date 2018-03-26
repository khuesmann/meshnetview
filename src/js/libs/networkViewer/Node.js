// import BABYLON from 'babylonjs';
// import MeshFactory from './MeshFactory';
export default class Node {
    constructor(scene, name, position, color, isPredefined) 
    {
        color = color || {r: 1, g: 0, b: 0, a: 1};
        this.scene = scene;
        this.name = name;
        this.id = !isPredefined ? viewerOptions.nodePrefix + name : viewerOptions.predefinedNodePrefix + name;
        this.mesh = MeshFactory.getNode(this.scene, name);
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y;
        this.mesh.position.z = position.z;
        this.mesh.material = MeshFactory.getColoredMaterial(this.scene, name, color.r, color.g, color.b, color.a);
        this.mesh.id = !isPredefined ? viewerOptions.nodePrefix + name : viewerOptions.predefinedNodePrefix + name;
        this.mesh.label = this.addText(name, "red");

        document.body.addEventListener('reset-networkviewer', (event) => {
            this.remove();
        });
        document.body.addEventListener('update-labels', (options) => {
            console.log('update labels');
            this.mesh.label.rotation.y =  -1 * options.detail - Math.PI / 2;
        });
    }

    addText(text, color) {
        let dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture" + text, 512, this.scene, true);
        dynamicTexture.hasAlpha = true;
        let plane = new BABYLON.Mesh.CreatePlane("TextPlane_" + text, 6, this.scene, true);
        plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", this.scene);
        plane.material.backFaceCulling = false;
        plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        plane.material.diffuseTexture = dynamicTexture;
        plane.material.diffuseTexture.uScale = 1;
        plane.material.diffuseTexture.vScale = 1;
        plane.position = new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y + 1, this.mesh.position.z);

        let size = dynamicTexture.getSize();
        if(text.length > 11) {
            dynamicTexture.drawText(text, 80, size.height / 2 + 30, "bold 22px Helvetica", color, "transparent", true);
            dynamicTexture.vScale = 0.5;
            plane.scaling.x = 2;
            plane.position = new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y - 1.5, this.mesh.position.z);

        }
        else {
            dynamicTexture.drawText(text, 80, size.height / 2 + 30, "bold 50px Helvetica", color, "transparent", true);
        }

        return plane;
    }

    hide() {
        this.mesh.visibility = false;
        this.mesh.label.visibility = false;
    }

    show() {
        this.mesh.visibility = true;
        this.mesh.label.visibility = true;
    }

    remove() {
        this.mesh.label.dispose();
        this.mesh.dispose();
    }
}