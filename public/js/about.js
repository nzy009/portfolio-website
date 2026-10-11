// Edit the software list here. Rows and item order follow the About page content.
const softwareTools = [
  { name: 'Adobe After Effects', row: 1, textFallback: true },
  { name: 'Adobe Photoshop', row: 1, textFallback: true },
  { name: 'Adobe Premiere Pro', row: 1, textFallback: true },
  { name: 'Blender', row: 1, icon: 'public/images/software-icons/blender.svg' },
  { name: 'Autodesk Maya', row: 1, icon: 'public/images/software-icons/autodeskmaya.svg' },
  { name: 'ZBrush', row: 2, textFallback: true },
  { name: 'Substance 3D Painter', row: 2, textFallback: true },
  { name: 'Nuke', row: 2, icon: 'public/images/software-icons/nuke.svg' },
  { name: 'iClone', row: 2, textFallback: true },
];

const marqueeRoot = document.querySelector('#tool-marquees');

function createTool(tool) {
  const item = document.createElement('span');
  item.className = 'tool-item';
  item.title = tool.name;
  item.setAttribute('aria-label', tool.name);

  if (tool.icon) {
    const image = document.createElement('img');
    image.src = tool.icon;
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    item.append(image);
  } else {
    const fallback = document.createElement('span');
    fallback.className = 'tool-fallback';
    fallback.textContent = tool.name;
    item.append(fallback);
  }

  if (tool.icon) {
    const label = document.createElement('span');
    label.className = 'tool-name';
    label.textContent = tool.name;
    item.append(label);
  }

  return item;
}

function createSequence(tools, hidden = false) {
  const sequence = document.createElement('div');
  sequence.className = 'tool-sequence';
  sequence.setAttribute('role', 'list');
  if (hidden) sequence.setAttribute('aria-hidden', 'true');
  tools.forEach((tool) => {
    const item = createTool(tool);
    item.setAttribute('role', 'listitem');
    sequence.append(item);
  });
  return sequence;
}

for (const row of [1, 2]) {
  const tools = softwareTools.filter((tool) => tool.row === row);
  const marquee = document.createElement('div');
  marquee.className = `tool-marquee${row === 2 ? ' tool-marquee--second' : ''}`;
  marquee.setAttribute('role', 'group');
  marquee.setAttribute('aria-label', `Tools row ${row}`);
  const track = document.createElement('div');
  track.className = 'tool-track';
  track.append(createSequence(tools), createSequence(tools, true));
  marquee.append(track);
  marqueeRoot.append(marquee);
}
