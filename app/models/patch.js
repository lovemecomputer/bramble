export default function Patch(attributes) {
  this.id = attributes.id;
  this.name = attributes.name || 'New Patch';
  this.body = attributes.body;
}
