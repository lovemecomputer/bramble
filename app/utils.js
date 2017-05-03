const utils = {
  copyState: (oldState, newState) => {
    return Object.assign({}, oldState, newState);
  },
  indexesToIds: array => {
    var lookup = {};
    for (var i = 0, length = array.length; i < length; i++) {
      lookup[array[i].patchId] = array[i];
    }
    return lookup; // now can use lookup[id]
  }
};

export default utils;
