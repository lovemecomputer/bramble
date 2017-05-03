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
  },
  indexOfObjectWithPropertyValue: (
    propertyToMatch,
    desiredValue,
    arrayToSearch
  ) => {
    console.log('arguments', propertyToMatch, desiredValue, arrayToSearch);
    function propertyMatch(object) {
      console.log('testing', object, object[propertyToMatch]);
      return object[propertyToMatch] === desiredValue;
    }
    return arrayToSearch.findIndex(propertyMatch);
  }
};

export default utils;
