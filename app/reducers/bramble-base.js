// @flow
import Patch from '../models/patch.js';

const examplePatch = new Patch({
  patchId: 'patch0',
  name: 'Test Patch',
  body: 'testing: example text'
});

const initialState = {
  patches: [examplePatch],
  patchCounter: 0
};

export default function bramble(currentState, action) {
  if (currentState === undefined) {
    return initialState;
  }

  switch (action.type) {
    case 'ADD_PATCH':
      let newState = Object.assign({}, currentState);
      newState.patches.push(action.newPatch);
      newState.patchCounter += 1;
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
