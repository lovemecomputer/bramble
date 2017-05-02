// @flow
import Patch from '../models/patch.js';

const examplePatch = new Patch({
  id: 'patch0',
  name: 'Test Patch',
  body: 'testing: example text'
});

const initialState = {
  patches: [examplePatch]
};

export default function bramble(currentState, action) {
  if (currentState === undefined) {
    console.log('! currentState undefined >>>>>', initialState);
    return initialState;
  }

  switch (action.type) {
    case 'ADD_PATCH':
      let newState = Object.assign({}, currentState);
      console.log('FUCCCK', newState);
      newState.patches.push(action.newPatch);
      // let updatedPatches = currentState.bramble.patches.slice();
      // patches.push(action.newPatch);
      // _.set(newState, 'bramble.patches', updatedPatches);
      return newState;

    default:
      console.log(
        '⚠️ unhandled action in reducers/bramble-base.js! \n ::>',
        action.type
      );
      return currentState;
  }
}
