/**
 * NetworkViewer by Karim Huesmann.
 * A library for three-dimensional visualisation of mesh-networks.
 */

import BABYLON from 'babylonjs';
import MeshFactory from './MeshFactory';
import NetworkViewerHelper from './Helper';

window.BABYLON = BABYLON;
window.MeshFactory = new MeshFactory();
window.NetworkViewerHelper = NetworkViewerHelper;
window.GPSHelper = require('./GPSHelper');

window.viewerOptions = {
  roomPrefix: 'room_',
  floorPrefix: 'floor_',
  materialPrefix: 'material_',
  edgePrefix: 'edge_',
  nodePrefix: 'node_',
  predefinedNodePrefix: 'preDefNode_'
};

import MainScene from './MainScene';
import Building from './Building';
import Node from './Node';
import Edge from './Edge';

export default class NetworkViewer {
  /**
   *
   * @param canvas
   */
  constructor (canvas) {
    this.canvas = canvas;
    this.mainScene = new MainScene(canvas);
    this.scene = this.mainScene.scene;
    this.edges = {};
    this.nodes = {};
    this.buildings = {};
  }

  /**
   *
   * @param buildingsData
   * @returns {{}|*}
   */
  addBuildings (buildingsData) {
    var fixPoint = NetworkViewerHelper.getFixPoint(buildingsData);
    var firstBuilding = null;
    for ( var buildingAlias in buildingsData ) {
      if ( ! buildingsData.hasOwnProperty(buildingAlias) ) continue;
      if ( ! firstBuilding ) {
        firstBuilding = buildingAlias;
        GPSHelper.fixPoint = {
          lat: buildingsData[buildingAlias].latitude,
          long: buildingsData[buildingAlias].longitude
        }
      }
      let building = new Building(this.scene, buildingsData[buildingAlias]);
      building.gpsRotation();
      building.scale();
      this.buildings[buildingAlias] = building;
    }
    return this.buildings;
  }

  /**
   *
   * @param identifier
   * @param level
   * @param positionX
   * @param positionY
   * @param positionZ
   * @param color
   * @returns {Node}
   */
  insertNode (identifier, level, positionX, positionY, positionZ, color) {
    var node = new Node(this.scene, identifier, { x: positionX, y: positionY, z: positionZ }, color);
    this.nodes[identifier] = node;
    return node;
  };

  /**
   *
   * @param node
   * @returns {Node}
   */
  insertNodeByRoom (node) {
    if ( ! node.building || ! this.buildings[node.building] ) return dump("Node's (" + node.identifier + ") building (" + node.building + ") not found.");
    var room = this.buildings[node.building].getRoomByName(node.room);
    if ( ! room ) return dump("Room " + node.room + " (node " + node.identifier + ") not found!");
    if(room.nodes.length != 0) room.nodeOffset += 0.8;
    var insertedNode = this.insertNode(node.identifier, room.floorLevel, room.mesh.position.x + 1 + room.nodeOffset, room.mesh.position.y + 1, room.mesh.position.z + 1 + room.nodeOffset);
    room.nodes.push(insertedNode);
    return insertedNode;
  }

  /**
   *
   * @param name
   * @param buildingAlias
   * @param floorLevel
   * @param latitude
   * @param longitude
   * @param color
   * @returns {Node}
   */
  insertNodeByGPS (name, buildingAlias, floorLevel, latitude, longitude, color) {
    var positionY = 1;
    var building = this.buildings[buildingAlias];
    if(!building) dump(`Node\'s (${name}) building (${buildingAlias}) not found`);
    var floor = building ? building.getFloor(floorLevel) : 0;
    if ( floor && floor.previousHeight > 0 ) positionY += floor.previousHeight;
    var gpsToXY = GPSHelper.gpsToXZ(latitude, longitude);
    var insertedNode = this.insertNode(name, floorLevel, gpsToXY.x, positionY, gpsToXY.z, color);
    return insertedNode;
  }

  /**
   * hide nodes
   */
  hideNodes () {
    for ( var i in this.nodes ) {
      if ( ! this.nodes.hasOwnProperty(i) ) continue;
      var node = this.nodes[i];
      node.hide();
      node.remove();
    }
    this.nodes = [];
  }

  /**
   *
   * @param startNode
   * @param endNode
   * @param rgb
   * @param width
   * @param edgeKey
   * @returns {Edge}
   */
  drawEdge (startNode, endNode, rgb, width, edgeKey) {
    rgb = rgb || [255, 0, 0];
    width = width || 0;
    var edge = new Edge(this.scene, startNode, endNode, rgb, width)
    this.edges[edgeKey] = edge;
    edge.show();
    return edge;
  }

  /**
   * remove edge
   * @param edgeKey
   */
  removeEdge (edgeKey) {
    this.edges[edgeKey].remove();
    delete this.edges[edgeKey];
  }
};