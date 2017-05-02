export default function Patch(attributes) {
  this.patchId = attributes.patchId;
  this.name = attributes.name || 'New Patch';
  this.body = attributes.body;
}
