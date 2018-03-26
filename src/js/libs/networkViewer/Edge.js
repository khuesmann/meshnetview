export default class Edge {
  /**
   *
   * @param scene
   * @param startNode
   * @param endNode
   * @param color
   * @param widthMetric
   */
  constructor (scene, startNode, endNode, color, widthMetric) {
    this.scene = scene;
    this.startNode = startNode.mesh;
    this.endNode = endNode.mesh;
    this.name = viewerOptions.edgePrefix + startNode.id + endNode.id;
    if ( this.startNode && this.endNode ) {
      var control1 = this.startNode.position.add(this.endNode.position).multiplyByFloats(0.5,0.5,0.5); // point btwn. start and end
      if(this.startNode.position.y == this.endNode.position.y) {
        if(this.startNode.position.x < this.endNode.position.x || this.startNode.position.z < this.endNode.position.z) {
          control1 = control1.subtract(new BABYLON.Vector3(0,1.5,0));
        }
        else {
          control1 = control1.add(new BABYLON.Vector3(0,1.5,0));
        }
      }
      else if(this.startNode.position.x == this.endNode.position.x && this.startNode.position.z == this.endNode.position.z) {
        if(this.startNode.position.y < this.endNode.position.y) {
          control1 = control1.add(new BABYLON.Vector3(1,0,0))
        }
        else {
          control1 = control1.subtract(new BABYLON.Vector3(1,0,0))
        }
      }
      else if(this.startNode.position.y < this.endNode.position.y) {
        control1 = control1.subtract(new BABYLON.Vector3(0,1.5,0));
      }
      else {
        control1 = control1.add(new BABYLON.Vector3(0,1.5,0));
      }
      var bezier = BABYLON.Curve3.CreateQuadraticBezier(this.startNode.position, control1, this.endNode.position, 20);
      this.mesh = BABYLON.Mesh.CreateTube(viewerOptions.edgePrefix + this.name, bezier.getPoints(), NetworkViewerHelper.getWidth(widthMetric), 6, null, null, this.scene);
      this.mesh.startIdenticator = BABYLON.Mesh.CreateTube(viewerOptions.edgePrefix + this.name + "_startIndicator", bezier.getPoints().slice(0, 4), NetworkViewerHelper.getWidth(widthMetric) * 1.10 , 60, null, 0, this.scene, false, BABYLON.Mesh.FRONTSIDE);
      this.mesh.material = MeshFactory.getColoredMaterial(this.scene, this.name + color[0] + color[1], color[0], color[1], color[2], 1);
      this.mesh.material.ambientColor = this.mesh.material.diffuseColor;
      this.mesh.material.emissiveColor = this.mesh.material.diffuseColor;

      document.body.addEventListener('reset-networkviewer', (event) => {
        this.hide();
        this.remove();
      });
    }
  }

  /**
   * show edge
   */
  show () {
    this.mesh.visibility = true;
    this.mesh.startIdenticator.visibility = true;
  }

  /**
   * hide edge
   */
  hide () {
    this.mesh.visibility = false;
    this.mesh.startIdenticator.visibility = false;
  }

  /**
   * remove edge
   */
  remove () {
    this.mesh.startIdenticator.dispose();
    this.mesh.dispose();
  }
}