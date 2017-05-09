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
      // QUESTION: returns the x value if all are true, but i don't understand why??
      x: (attributes.editor &&
        attributes.editor.position &&
        attributes.editor.position.x) ||
        0,
      y: (attributes.editor &&
        attributes.editor.position &&
        attributes.editor.position.y) ||
        0
    }
  };
}
