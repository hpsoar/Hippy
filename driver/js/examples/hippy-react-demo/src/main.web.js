import {
  HippyWebEngine,
} from '@hippy/web-renderer';

import SceneBuilder from './shared/scene_builder';

import './main';


const engine = HippyWebEngine.create({
  modules: {},
  components: {},
});

SceneBuilder.UIManagerModule = engine.modules.UIManagerModule;

global.Hippy.SceneBuilder = SceneBuilder;

engine.start({
  id: 'root',
  name: 'Demo',
  params: {
    path: '/home',
    business: 'Demo',
    data: {
      username: 'test', // Example of passing parameters
    },
  },
});
