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
      if (targetIndex !== null) {
        var updatedPatch = Object.assign({}, currentState.patches[targetIndex]);
        updatedPatch.body = action.body;
        var updatedPatches = currentState.patches.slice();
        updatedPatches[targetIndex] = updatedPatch;
        return Object.assign({}, currentState, {
          patches: updatedPatches
        });
      } else {
        return currentState;
      }

    case 'DELETE_PATCH':
      var targetIndex = utils.indexOfObjectWithPropertyValue(
        'patchId',
        action.patchId,
        currentState.patches
      );
      if (targetIndex !== null) {
        var updatedPatches = currentState.patches.slice();
        updatedPatches.splice(targetIndex, 1);
        return Object.assign({}, currentState, {
          patches: updatedPatches
        });
      } else {
        return currentState;
      }

    case 'TOGGLE_MARKDOWN_PREVIEW':
      return Object.assign({}, currentState, {
        displayMarkdownPreview: !currentState.displayMarkdownPreview
      });

    case 'SHOWING_PATCH':
      return Object.assign({}, currentState, {
        onEscape: action.onEscape,
        onCmdEnter: action.onCmdEnter,
        onToggleMarkdownPreview: action.onToggleMarkdownPreview
      });
    case 'SHOWING_PATCHBOARD':
      return Object.assign({}, currentState, {
        onNewPatchShortcut: action.onNewPatchShortcut
      });

    case 'HOTKEY':
      let functionToRun;
      if (action.key === 'Escape') {
        // escape key to close
        functionToRun = currentState.onEscape;
      } else if (action.key === 'Enter' && action.withMeta) {
        functionToRun = currentState.onCmdEnter;
      } else if (action.key === 'n' && action.withMeta) {
        // cmd + n for new patch
        functionToRun = currentState.onNewPatchShortcut;
      } else if (
        (action.key === 'm' || action.key === 'M') &&
        action.withShift &&
        action.withCtrl
      ) {
        functionToRun = currentState.onToggleMarkdownPreview;
      }
      if (functionToRun) {
        setTimeout(() => {
          functionToRun();
        }, 0);
      }

      return currentState;

    case 'LOCATION_CHANGE':
      return currentState;

    default:
      console.log(
        '⚠️ unhandled action in reducers/bramble-base.js! \n ::>',
        action.type
      );
      return currentState;
  }
}
