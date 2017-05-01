// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import brambleBase from './bramble-base.js';

import counter from './counter';

const rootReducer = combineReducers({
  brambleBase,
  counter,
  router
});

export default rootReducer;
