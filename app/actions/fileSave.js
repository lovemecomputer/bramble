const dialog = require('electron').remote.dialog;
const fs = require('fs');

export default function fileSave(inputState) {
  return (dispatch, getState) => {
    console.log('>>>action:::  saving file!! >>>');
    let stateToSave = JSON.stringify(inputState, null, 2);
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
  };
}
