// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import bramble from './bramble-base.js';

import counter from './counter';

const rootReducer = combineReducers({
  bramble,
  counter,
  router
});

export default rootReducer;
