import Patch from '../models/patch.js';

export default function newPatch() {
  return (dispatch, getState) => {
    const newPatch = new Patch({
      patchId: Number(getState().bramble.patchCounter + 1),
      name: 'New Patch',
      body: 'example text'
    });
    dispatch({
      type: 'ADD_PATCH',
      newPatch: newPatch
    });
  };
}
