// @flow
import Patch from '../models/patch.js';
import utils from '../utils.js';

const dialog = require('electron').remote.dialog;
const fs = require('fs');

let examplePatch = new Patch({
  patchId: 0,
  isStartingPatch: true,
  content: {
    name: 'Example Patch',
    body: 'Welcome to **Bramble** — an app to create interactive fiction, text-based games, or whatever you come up with.\n\nEach individual unit is called a *patch*.\n\nThis is a link to another patch: @Move ahead:1'
  },
  editor: {
    position: {
      x: 60,
      y: 100,
      z: 1
    }
  }
});

let examplePatch2 = new Patch({
  patchId: 1,
  isStartingPatch: false,
  content: {
    name: 'Second Example Patch',
    body: '## Next steps\n\nIf you are outputting to web, **Bramble** will allow you to *format* your text with Markdown.\n\n---\n\n@Go back.:0\n\n**@Keep going.:2**'
  },
  editor: {
    position: {
      x: 360,
      y: 100,
      z: 2
    }
  }
});

let examplePatch3 = new Patch({
  patchId: 2,
  isStartingPatch: false,
  content: {
    name: 'Third Example Patch',
    body: '# Tell a story~\n\n**Bramble** will allow you to publish in a format that can be easily shared to anyone that can browse the internet.\n\nOr, use **Bramble** as an authoring tool, and export your data do use in other systems.\n\n@Go back to the first patch:0 or @the second patch:1 woohoo.'
  },
  editor: {
    position: {
      x: 520,
      y: 400,
      z: 3
    }
  }
});

const exampleState = {
  projectId: '',
  projectName: 'Example Project',
  patches: [examplePatch, examplePatch2, examplePatch3],
  patchCounter: 2, // used to make IDs until autocomplete & unique ID system is implemented
  displayFormattedPreview: true,
  menuOpenedPatch: -1
};

const newState = {
  projectId: '',
  projectName: 'New Project',
  patches: [],
  patchCounter: 0, // used to make IDs until autocomplete & unique ID system is implemented
  displayFormattedPreview: true,
  menuOpenedPatch: -1
};

export default function bramble(currentState, action) {
  if (currentState === undefined) {
    return exampleState;
  }

  switch (action.type) {
    case 'ADD_PATCH':
      var updatedPatches = currentState.patches.slice();
      updatedPatches.push(action.newPatch);
      let updatedPatchCounter = currentState.patchCounter + 1;
      return Object.assign({}, currentState, {
        patches: updatedPatches,
        patchCounter: updatedPatchCounter
      });

    case 'UPDATE_PATCH_POSITION':
      var targetIndex = utils.indexOfObjectWithPropertyValue(
        'patchId',
        action.patchId,
        currentState.patches
      );
      var updatedPatch = Object.assign({}, currentState.patches[targetIndex]);
      updatedPatch.editor.position.x = action.x;
      updatedPatch.editor.position.y = action.y;
      var updatedPatches = currentState.patches.slice();
      updatedPatches[targetIndex] = updatedPatch;
      return Object.assign({}, currentState, {
        patches: updatedPatches
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

    case 'OPEN_PATCH_NODE_MENU':
      return Object.assign({}, currentState, {
        menuOpenedPatch: action.patchId
      });

    case 'CLOSE_PATCH_NODE_MENU':
      return Object.assign({}, currentState, {
        menuOpenedPatch: -1
      });

    case 'SET_STARTING_PATCH':
      var targetIndex = utils.indexOfObjectWithPropertyValue(
        'patchId',
        action.patchId,
        currentState.patches
      );
      if (targetIndex !== null) {
        var updatedPatches = currentState.patches.slice();
        updatedPatches.forEach(patch => {
          if (patch.patchId === action.patchId) {
            patch.isStartingPatch = true;
          } else {
            patch.isStartingPatch = false;
          }
        });
        return Object.assign({}, currentState, {
          patches: updatedPatches
        });
      } else {
        return currentState;
      }

    case 'BRING_PATCH_NODE_TO_FRONT':
      var targetIndex = utils.indexOfObjectWithPropertyValue(
        'patchId',
        action.patchId,
        currentState.patches
      );
      if (targetIndex !== null) {
        if (
          currentState.patches[targetIndex].editor.position.z ===
          currentState.patches.length
        ) {
          return currentState;
        } else {
          var updatedPatches = currentState.patches.slice();
          updatedPatches.forEach(patch => {
            if (patch.patchId === action.patchId) {
              patch.editor.position.z = currentState.patches.length;
            } else {
              patch.editor.position.z--;
              if (patch.editor.position.z === 0) {
                patch.editor.position.z = 1;
              }
            }
          });
          return Object.assign({}, currentState, {
            patches: updatedPatches
          });
        }
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
        onCtrlShiftM: action.onCtrlShiftM,
        onCmdL: action.onCmdL
      });

    case 'SHOWING_PATCHBOARD':
      return Object.assign({}, currentState, {
        onCmdN: action.newPatchShortcut,
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
        functionToRun = currentState.onCmdN;
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
      } else if (
        (action.key === 'l' || action.key === 'L') &&
        action.withMeta
      ) {
        functionToRun = currentState.onCmdL;
      }
      if (functionToRun) {
        setTimeout(() => {
          functionToRun();
        }, 0);
      }
      return currentState;

    case 'FILE_SAVE':
      console.log('>>> saving file!! >>>');
      let stateToSave = JSON.stringify(currentState, null, 2);
      dialog.showSaveDialog(
        {
          filters: [{ name: 'text', extensions: ['json'] }]
        },
        fileName => {
          if (fileName === undefined) return;
          fs.writeFile(fileName, stateToSave, err => {
            if (err === undefined) {
              dialog.showMessageBox({
                message: 'The file has been saved! 🌱',
                buttons: ['OK']
              });
            } else {
              dialog.showErrorBox('File Save Error', err.message);
            }
          });
        }
      );
      return currentState;

    case 'LOAD_STATE':
      return Object.assign({}, action.loadedState);

    case 'NEW_PROJECT':
      return Object.assign({}, newState);

    case '@@router/LOCATION_CHANGE':
      console.log('🗺 current location: \n', window.location.hash);
      return currentState;

    default:
      console.log(
        '⚠️ unhandled action in reducers/bramble-base.js! \n ::>',
        action.type
      );
      return currentState;
  }
}
