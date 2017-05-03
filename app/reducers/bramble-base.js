// @flow
import Patch from '../models/patch.js';
import utils from '../utils.js';

const examplePatch = new Patch({
  patchId: 0,
  name: 'First Patch',
  body: 'example text'
});

const initialState = {
  patches: [examplePatch],
  patchCounter: 0,
  displayMarkdownPreview: false
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

    case 'UPDATE_PATCH_NAME':
      var targetIndex = utils.indexOfObjectWithPropertyValue(
        'patchId',
        action.patchId,
        currentState.patches
      );
      var updatedPatch = Object.assign({}, currentState.patches[targetIndex]);
      updatedPatch.name = action.name;
      var updatedPatches = currentState.patches.slice();
      updatedPatches[targetIndex] = updatedPatch;
      return Object.assign({}, currentState, {
        patches: updatedPatches
      });

    case 'UPDATE_PATCH_BODY':
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

    case 'TOGGLE_MARKDOWN_PREVIEW':
      return Object.assign({}, currentState, {
        displayMarkdownPreview: !currentState.displayMarkdownPreview
      });

    case 'SHOWING_PATCH':
      return Object.assign({}, currentState, { onEscape: action.onEscape });
    case 'SHOWING_PATCHBOARD':
      return Object.assign({}, currentState, {
        onNewPatchShortcut: action.onNewPatchShortcut
      });

    case 'HOTKEY':
      let functionToRun;
      if (action.key === 'Escape') {
        functionToRun = currentState.onEscape;
      } else if (action.key === 'n' && action.withMeta) {
        functionToRun = currentState.onNewPatchShortcut;
      }
      if (functionToRun) {
        setTimeout(() => {
          functionToRun();
        }, 0);
      }

      return currentState;

    default:
      console.log(
        '⚠️ unhandled action in reducers/bramble-base.js! \n ::>',
        action.type
      );
      return currentState;
  }
}
