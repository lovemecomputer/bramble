import ProjectUtilities from './ProjectUtilities.js';

export default function BrambleProject(attributes) {
  this.projectId = attributes.projectId || '';
  this.projectName = attributes.projectName || '';
  this.content = {
    // QUESTION: returns attributes.content.patches for whatever reason?
    patches: (attributes.content && attributes.content.patches) || []
  };
  this.editor = {
    patchCounter: (attributes.editor && attributes.editor.patchCounter) || 0,
    displayFormattedPreview: (attributes.editor &&
      attributes.editor.displayFormattedPreview) ||
      true,
    zoomLevel: (attributes.editor && attributes.editor.zoomLevel) || 0
  };
  this.utils = new ProjectUtilities(this);
}
