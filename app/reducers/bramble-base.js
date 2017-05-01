// @flow
import Patch from '../models/patch.js';

const examplePatch = new Patch({
  id: 'patch0',
  name: 'Test Patch',
  body: 'testing: example text'
});

const initialState = {
  patches: [examplePatch]
};

export default function brambleBase(currentState, action) {
  if (currentState === undefined) {
    console.log('! currentState undefined >>>>>', initialState);
    return initialState;
  }

  switch (action.type) {
    case 'ACTION':
      return currentState;

    default:
      console.log(
        '⚠️ unhandled action in reducers/bramble-base.js! \n ::>',
        action.type
      );
      return currentState;
  }
}
