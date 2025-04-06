import { EventContentArg } from '@fullcalendar/core';

export function renderCustomEvent(arg: EventContentArg): { domNodes: Node[] } {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.justifyContent = 'space-between';
  container.style.backgroundColor = '#e0e7ff';
  container.style.color = '#000';
  container.style.borderRadius = '8px';
  container.style.padding = '4px';
  container.style.width = '100%';
  container.style.boxSizing = 'border-box';

  const title = document.createElement('div');
  title.textContent = arg.event.title;
  title.style.fontWeight = 'bold';
  title.style.textAlign = 'center';
  title.style.width = '100%';
  title.style.whiteSpace = 'normal';
  title.style.wordWrap = 'break-word';

  const description = document.createElement('div');
  description.textContent = arg.event.extendedProps['description'];
  description.style.fontSize = '0.8rem';
  description.style.color = '#333';
  description.style.textAlign = 'left';
  description.style.marginTop = '2px';
  description.style.maxHeight = '3.6rem';
  description.style.overflowY = 'auto';
  description.style.whiteSpace = 'normal';
  description.style.wordWrap = 'break-word';
  description.style.lineHeight = '1.2rem';
  description.style.paddingRight = '4px';

  const duration = document.createElement('button');
  duration.textContent = `${arg.event.extendedProps['duration']}h`;
  duration.style.background = '#6a11cb';
  duration.style.color = 'white';
  duration.style.border = 'none';
  duration.style.borderRadius = '12px';
  duration.style.padding = '2px 8px';
  duration.style.fontSize = '0.75rem';
  duration.style.marginTop = '4px';
  duration.style.alignSelf = 'flex-end';
  duration.style.maxWidth = 'fit-content';

  container.appendChild(title);
  container.appendChild(description);
  container.appendChild(duration);

  return { domNodes: [container] };
}
