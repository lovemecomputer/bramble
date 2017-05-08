// @flow
import Patch from '../models/patch.js';
import utils from '../utils.js';

// const examplePatch = new Patch({
//   patchId: 0,
//   content: {
//     name: 'Example Patch',
//     body: 'Welcome to **Bramble** — an app to create interactive fiction, text-based games, or whatever you come up with.\n\nEach individual unit is called a *patch*.\n\nThis is a link to another patch: @Move ahead:1'
//   },
//   editor: {
//     position: {}
//   }
// });

const examplePatch = new Patch({
  patchId: 0,
  content: {
    name: 'Example Patch',
    body: 'Welcome to **Bramble** — an app to create interactive fiction, text-based games, or whatever you come up with.\n\nEach individual unit is called a *patch*.\n\nThis is a link to another patch: @Move ahead:1'
  }
});

const examplePatch2 = new Patch({
  patchId: 1,
  content: {
    name: 'Second Example Patch',
    body: '## Next steps\n\nIf you are outputting to web, **Bramble** will allow you to *format* your text with Markdown.\n\n---\n\n@Go back.:0\n\n**@Keep going.:2**'
  }
});

const examplePatch3 = new Patch({
  patchId: 2,
  content: {
    name: 'Third Example Patch',
    body: '# Tell a story~\n\n**Bramble** will allow you to publish in a format that can be easily shared to anyone that can browse the internet.\n\nOr, use **Bramble** as an authoring tool, and export your data do use in other systems.\n\n@Go back to the first patch:0 or @the second patch:1 woohoo.'
  }
});

const initialState = {
  patches: [examplePatch, examplePatch2, examplePatch3],
  // patches: [examplePatch],
  // patches: [],
  patchCounter: 2,
  // patchCounter: 0,
  displayFormattedPreview: true
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
      updatedPatch.content.name = action.name;
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
        updatedPatch.content.body = action.body;
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

    case 'TOGGLE_FORMATTED_PREVIEW':
      return Object.assign({}, currentState, {
        displayFormattedPreview: !currentState.displayFormattedPreview
      });

    case 'SHOWING_PATCH_EDIT':
      return Object.assign({}, currentState, {
        onEscape: action.onEscape,
        onCmdEnter: action.onCmdEnter,
        onCtrlShiftM: action.onCtrlShiftM
      });

    case 'SHOWING_PATCHBOARD':
      return Object.assign({}, currentState, {
        onNewPatchShortcut: action.onNewPatchShortcut,
        onCmdP: action.initiatePreview
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
        (action.key === 'p' || action.key === 'P') &&
        action.withMeta
      ) {
        functionToRun = currentState.onCmdP;
      } else if (
        (action.key === 'm' || action.key === 'M') &&
        action.withShift &&
        action.withCtrl
      ) {
        functionToRun = currentState.onCtrlShiftM;
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
