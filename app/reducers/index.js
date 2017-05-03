// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import bramble from './bramble-base.js';

const rootReducer = combineReducers({
  bramble,
  router
});

export default rootReducer;
