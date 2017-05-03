// @flow
import Patch from '../models/patch.js';
import utils from '../utils.js';

const examplePatch = new Patch({
  patchId: 0,
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
      var updatedPatches = currentState.patches.slice();
      updatedPatches.push(action.newPatch);
      let updatedPatchCounter = updatedPatches.length;
      return Object.assign({}, currentState, {
        patches: updatedPatches,
        patchCounter: updatedPatchCounter
      });

    case 'UPDATE_PATCH':
      var targetIndex = utils.indexOfObjectWithPropertyValue(
        'patchId',
        action.patchId,
        currentState.patches
      );
      var updatedPatch = Object.assign({}, currentState.patches[targetIndex]);
      updatedPatch.body = action.body;
      var updatedPatches = currentState.patches.slice();
      updatedPatches[targetIndex] = updatedPatch;
      return Object.assign({}, currentState, {
        patches: updatedPatches
      });

    default:
      console.log(
        '⚠️ unhandled action in reducers/bramble-base.js! \n ::>',
        action.type
      );
      return currentState;
  }
}
