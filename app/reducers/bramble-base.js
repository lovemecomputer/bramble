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
      let updatedPatchCounter = (currentState.patchCounter += 1);
      return Object.assign({}, currentState, {
        patches: updatedPatches,
        patchCounter: updatedPatchCounter
      });

    case 'UPDATE_PATCH':
      // var updatedPatches = currentState.patches.slice();
      var updatedPatch = Object.assign(
        {},
        currentState.patches[
          utils.indexOfObjectWithPropertyValue(
            'patchId',
            action.patchId,
            currentState.patches
          )
        ]
      );
      updatedPatch.body = action.body;
      return Object.assign({}, currentState);

    default:
      console.log(
        '⚠️ unhandled action in reducers/bramble-base.js! \n ::>',
        action.type
      );
      return currentState;
  }
}
