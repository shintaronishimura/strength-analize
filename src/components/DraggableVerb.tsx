import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Verb } from '../types';

interface Props {
  verb: Verb;
}

export const DraggableVerb: React.FC<Props> = ({ verb }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: verb.id,
    data: { verb }
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 1000 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`postit ${verb.category}`}
    >
      {verb.text}
    </div>
  );
};
