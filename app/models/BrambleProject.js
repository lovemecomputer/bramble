import ProjectUtilities from './ProjectUtilities.js';

export default function BrambleProject(attributes) {
  this.projectId = attributes.projectId || '';
  this.projectName = attributes.projectName || '';
  this.content = {
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

  this.addPatch = newPatch => {
    return new BrambleProject({
      projectId: this.projectId,
      projectName: this.projectName,
      content: {
        patches: this.content.patches.push(newPatch)
      },
      editor: {
        patchCounter: this.editor.patchCounter + 1,
        displayFormattedPreview: this.editor.displayFormattedPreview,
        zoomLevel: this.editor.zoomLevel
      }
    });
  };

  this.incrementPatchCounter = () => {
    return new BrambleProject({
      projectId: this.projectId,
      projectName: this.projectName,
      content: this.content,
      editor: {
        patchCounter: this.editor.patchCounter + 1,
        displayFormattedPreview: this.editor.displayFormattedPreview,
        zoomLevel: this.editor.zoomLevel
      }
    });
  };
}
