const dialog = require('electron').remote.dialog;
const fs = require('fs');

import Patch from '../models/patch.js';

export default function fileOpen() {
  return (dispatch, getState) => {
    console.log('>>> action script:::: opening file!! >>>');

    var loadedState = {};

    dialog.showOpenDialog(
      {
        filters: [
          { name: 'bramble file', extensions: ['bramble'] },
          { name: 'json', extensions: ['json'] },
          { name: 'text', extensions: ['txt'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      },
      function(fileNames) {
        if (fileNames === undefined) return;

        var fileName = fileNames[0];

        fs.readFile(fileName, 'utf-8', function(err, data) {
          var jsData = JSON.parse(data);
          loadedState = jsData;
          loadedState.patches = loadedState.patches.map((patch, index) => {
            return new Patch({
              patchId: patch.patchId,
              isStartingPatch: patch.isStartingPatch,
              content: {
                name: patch.content.name,
                body: patch.content.body,
                css: patch.content.css,
                script: patch.content.script,
                linkTargets: patch.content.linkTargets
              },
              editor: {
                position: {
                  x: patch.editor.position.x,
                  y: patch.editor.position.y
                }
              }
            });
          });
          console.log(loadedState);
          dispatch({
            type: 'LOAD_STATE',
            loadedState: loadedState
          });
        });
      }
    );
    console.log('loaded state:', loadedState);
    // dispatch({
    //   type: 'OPEN_SHIT_TEST',
    //   loadedState: loadedState
    // });
  };
}
