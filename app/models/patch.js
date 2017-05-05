export default function Patch(attributes) {
  this.patchId = attributes.patchId;
  this.name = attributes.name;
  this.body = attributes.body;
}

/* TODO:
- add property to keep track of position, look at trello cards for reference
- add method to set the position more easily!
  (maybe this can be done without reducer?
  and then it would dispatch a reducer action after raising the mouse button?)
*/
