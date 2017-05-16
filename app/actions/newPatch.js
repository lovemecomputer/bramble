import Patch from '../models/patch.js';

export default function newPatch() {
  return (dispatch, getState) => {
    const patchesLength = getState().bramble.patches.length;
    let isStarting = false;
    if (patchesLength === 0) isStarting = true;

    const newPatch = new Patch({
      patchId: Number(getState().bramble.patchCounter + 1),
      isStartingPatch: isStarting,
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
          y: 60,
          z: patchesLength
        }
      }
    });
    dispatch({
      type: 'ADD_PATCH',
      newPatch: newPatch
    });
  };
}
