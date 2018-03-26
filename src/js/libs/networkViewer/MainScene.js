/**
 *
 * @param canvas
 * @param buildingData
 * @constructor
 */
export default class MainScene {

    constructor(canvas, buildingData)
    {
        // create canvas
        this.canvas = canvas;

        // save building data so it's available globally in this scope
        this.buildingData = buildingData || {length: 20, height: 20};

        // create engine
        this.engine = new BABYLON.Engine(this.canvas, true);

        // create scene
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color4(0,0,0,0);

        // create camera
        this.camera = this.radialCamera();
        this.cameraLastPosition = this.camera.position;

        // create light
        this.light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0,2,0), this.scene);
        this.light.intensity = 0.9;

        document.getElementById('meshNetVCanvas').addEventListener('mouseup', () => {
            document.body.dispatchEvent(new CustomEvent('update-labels', { detail: this.scene.activeCamera.alpha }));
        });
    }
    
    render() {
        var self = this;
        this.engine.runRenderLoop(function () {
            self.scene.render();
        });
        window.addEventListener("resize", function () {
            self.engine.resize();
        });
    }

    stop() {
        var self = this;
        this.scene.dispose();
        setTimeout(function() {
            self.engine.stopRenderLoop();
        },0);
    }

    wasdCamera() {
        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5,-10), this.scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(this.canvas, false);

        // Remap keys to move with ZQSD
        camera.keysUp = [87]; // Z
        camera.keysDown = [83]; // S
        camera.keysLeft = [65]; // Q
        camera.keysRight = [68]; // D
        camera.type = "wasd";
        if(this.cameraLastPosition) camera.position = this.cameraLastPosition;

        return camera;
    }

    radialCamera() {
        var target = new BABYLON.Vector3(this.buildingData.length / 2, this.buildingData.height / 2, 0);
        // var target = new BABYLON.Vector3(0.5, 0, 0.5);
        var radius = Math.PI / 2;
        if(this.cameraLastPosition) target = this.cameraLastPosition;
        if(this.cameraLastPosition) radius = 0;
        var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 2, radius, target, this.scene);
        camera.attachControl(this.canvas, true);
        camera.lowerBetaLimit = 0.1;
        camera.upperBetaLimit = (Math.PI / 2) * 0.99;
        camera.lowerRadiusLimit = 30;
        camera.type = "radial";
        return camera;
    }

    toggleCamera() {
        this.cameraLastPosition = this.scene.activeCamera.position;
        if(this.scene.activeCamera.type == 'wasd') this.scene.activeCamera = this.radialCamera();
        else if(this.scene.activeCamera.type == 'radial') this.scene.activeCamera = this.wasdCamera();
        setTimeout(() => {
            document.getElementById('meshNetVCanvas').addEventListener('mouseup', () => {
                document.body.dispatchEvent(new CustomEvent('update-labels', { detail: this.scene.activeCamera.alpha }));
            });
        });
        return this.scene.activeCamera.type;
    }

    stopEngine() {
        this.engine.endFrame();
    }
}