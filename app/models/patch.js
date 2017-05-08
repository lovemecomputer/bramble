export default function Patch(attributes) {
  this.patchId = attributes.patchId;
  this.content = {
    name: attributes.content.name || '',
    body: attributes.content.body || '',
    linkTargets: attributes.linkTargets || [],
    css: attributes.css || '',
    script: attributes.script || ''
  };
  this.editor = {
    position: {
      x: () => {
        if (attributes.editor.position.x)
        return Number(attributes.editor.position.x) || 0;
      },
      y: () => {
        if (attributes.editor.position.y)
        return Number(attributes.editor.position.y) || 0;
      },
    }
  } || {
    position: {
      x: 0,
      y: 0
    }
  };
}

/* TODO:
- add property to keep track of position,
  look at trello cards for reference
- add method to set the position more easily!
  (maybe this can be done without reducer?
  and then it would dispatch a reducer action
  after raising the mouse button?)
*/
