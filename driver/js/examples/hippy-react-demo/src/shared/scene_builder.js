import { Hippy } from '@hippy/react';

class SceneBuilder {
  static UIManagerModule;

  constructor(rootViewId) {
    this.rootViewId = rootViewId;
    this.buildActions = [];
    this.hasCreateActions = false;
    this.afterCreateActions = [];
  }

  create(nodes) {
    // SceneBuilder.UIManagerModule.createNode(this.rootViewId, nodes);
    if (!nodes || !nodes.length) {
      return;
    }

    this.hasCreateActions = true;

    nodes.forEach((n) => {
      const [node, ref] = n;
      if (!ref.refId) {
        return;
      }

      const view = SceneBuilder.UIManagerModule.findViewById(ref.refId);
      if (view && view.index == undefined && view.pId) {
          const parentView = SceneBuilder.UIManagerModule.findViewById(view.pId);
          if (parentView) {
            const childNodes = [].slice.call(parentView.dom.childNodes || []);
            view.index = childNodes.indexOf(view.dom);
          }
      }
      if (view.index) {
        node.index = view.index;
        view.index += 1;
      }
    });

    nodes = nodes.map((n) => n[0]);
    this.buildActions.push(() => {
      global.Hippy.bridge.callNative('UIManagerModule', 'createNode', this.rootViewId, nodes);
    })
  }
  update = (nodes) => { 
    nodes = nodes.map((n) => n[0]);
    this.buildActions.push(() => {
      global.Hippy.bridge.callNative('UIManagerModule', 'updateNode', this.rootViewId, nodes);
    })
  };
  delete = (nodes) => {
    nodes = nodes.map((n) => n[0]);
    this.buildActions.push(() => {
      global.Hippy.bridge.callNative('UIManagerModule', 'deleteNode', this.rootViewId, nodes);
    })
   };
  move = (nodes) => {
    console.log('hello');
  };
  build = () => {
    if (this.hasCreateActions) {
      const afterCreateActions = this.afterCreateActions;
      SceneBuilder.UIManagerModule.addAfterCreateAction(() => {
        afterCreateActions.forEach(item => item());
      });
    }
    this.buildActions.forEach(item => item());
  };
  addEventListener = (id, eventName, listener, isCapture) => {
    console.log(eventName);

    if (this.hasCreateActions) {
      this.afterCreateActions.push(() => {
        this._addEventListener(id, eventName, listener, isCapture).then(() => {
        });
      });
    } else {
      this.buildActions.push(() => {
        this._addEventListener(id, eventName, listener, isCapture).then(() => {
          console.log(`done: ${id}, ${eventName}`);
        });
      });
    }
  };
  removeEventListener = (id, eventName, listener) => {
    this.buildActions.push(() => {
      const view = SceneBuilder.UIManagerModule.findViewById(id);
      if (view) {
        console.log(view);
        if (view.dom) {
          // if (eventName === 'click') {
            // view.updateProperty('onClick', false);
          // } else {
            view.dom.removeEventListener(eventName, listener);
          // }
        }
      }
    })
  };

  _addEventListener = async (id, eventName, listener, isCapture) => {
    const view = SceneBuilder.UIManagerModule.findViewById(id);
    if (view) {
      console.log(view);
      if (view.dom) {
        // if (eventName === 'click') {
          // view.updateProperty('onClick', true);
        // } else {
          view.dom.addEventListener(eventName, (event) => {
            event.id = id;
            event.currentId = id;
            listener(event);
          }, isCapture);
        // }
      }
    }
  };
}


export default SceneBuilder;

