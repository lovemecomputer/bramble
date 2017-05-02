import Patch from '../models/patch.js';

export default function newPatch() {
  return (dispatch, getState) => {
    console.log('adding patch');
    console.log('getting state in action:', getState());
    console.log('patch counter is', getState().bramble.patchCounter);
    const newPatch = new Patch({
      id: `patch${getState().bramble.patchCounter + 1}`,
      name: 'New Patch',
      body: 'example text'
    });
    console.log('new patch:', newPatch);
    dispatch({
      type: 'ADD_PATCH',
      newPatch: newPatch
    });
  };
}
