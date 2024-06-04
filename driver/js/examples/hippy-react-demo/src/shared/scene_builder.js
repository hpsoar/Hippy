import { Hippy } from '@hippy/react';

class SceneBuilder {
  static UIManagerModule;

  constructor(rootViewId) {
    this.rootViewId = rootViewId;
  }

  create(nodes) {
    // SceneBuilder.UIManagerModule.createNode(this.rootViewId, nodes);
    nodes = nodes.map((n) => n[0]);
    global.Hippy.bridge.callNative('UIManagerModule', 'createNode', this.rootViewId, nodes);
  }
  update = (nodes) => { };
  delete = (nodes) => { };
  move = (nodes) => { };
  build = () => { };
  addEventListener = (id, eventName, listener) => { };
  removeEventListener = (id, eventName, listener) => { };
}


export default SceneBuilder;

