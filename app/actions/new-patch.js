import Patch from '../models/patch.js';

export default function newPatch() {
  return (dispatch, getState) => {
    const newPatch = new Patch({
      patchId: Number(getState().bramble.project.editor.patchCounter + 1),
      content: {
        name: '',
        body: '',
        linkTargets: [],
        css: '',
        script: ''
      },
      editor: {
        position: {
          x: 60,
          y: 60
        }
      }
    });
    dispatch({
      type: 'ADD_PATCH',
      newPatch: newPatch
    });
  };
}
