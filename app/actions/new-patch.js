import Patch from '../models/patch.js';

export default function newPatch() {
  return (dispatch, getState) => {
    let isStarting = false;
    if (getState().bramble.patches.length === 0) isStarting = true;

    const newPatch = new Patch({
      patchId: Number(getState().bramble.patchCounter + 1),
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
        },
        isStartingPatch: isStarting
      }
    });
    dispatch({
      type: 'ADD_PATCH',
      newPatch: newPatch
    });
  };
}
