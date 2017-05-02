import Patch from '../models/patch.js';

export default function newPatch() {
  return (dispatch, getState) => {
    console.log('adding patch');
    console.log(getState());
    const newPatch = new Patch({
      id: String(Math.random()),
      name: 'New Patch',
      body: 'example text'
    });
    console.log(newPatch);
    dispatch({
      type: 'ADD_PATCH',
      newPatch: newPatch
    });
  };
}
