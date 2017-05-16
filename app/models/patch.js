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
      x: (attributes.editor &&
        attributes.editor.position &&
        attributes.editor.position.x) ||
        0,
      y: (attributes.editor &&
        attributes.editor.position &&
        attributes.editor.position.y) ||
        0,
      z: (attributes.editor &&
        attributes.editor.position &&
        attributes.editor.position.z) ||
        0
    },
    isStartingPatch: (attributes.editor && attributes.editor.isStartingPatch) ||
      false
  };
}
