import ProjectUtilities from './ProjectUtilities.js';

export default function BrambleProject(attributes) {
  this.projectId = attributes.projectId || '';
  this.projectName = attributes.projectName || '';
  this.content = {
    // QUESTION: returns attributes.content.patches for whatever reason?
    patches: (attributes.content && attributes.content.patches) || [],
    patchCounter: (attributes.content && attributes.content.patchCounter) || 0
  };
  this.editorSettings = {
    displayFormattedPreview: (attributes.editorSettings &&
      attributes.editorSettings.displayFormattedPreview) ||
      true,
    zoomLevel: (attributes.editorSettings &&
      attributes.editorSettings.zoomLevel) ||
      0
  };
  this.utils = new ProjectUtilities(this);
}
