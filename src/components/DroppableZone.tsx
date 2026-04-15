import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Category, Verb } from '../types';
import { DraggableVerb } from './DraggableVerb';

interface Props {
  id: Category;
  title: string;
  description: string;
  verbs: Verb[];
}

export const DroppableZone: React.FC<Props> = ({ id, title, description, verbs }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const style: React.CSSProperties = {
    backgroundColor: isOver ? '#f1f5f9' : 'white',
    border: isOver ? '2px dashed var(--color-primary)' : '2px solid transparent',
    transition: 'all 0.2s',
  };

  return (
    <div ref={setNodeRef} style={style} className={`droppable-zone ${id}`}>
      <div className="zone-header">
        <h3>{title}</h3>
        <p className="description">{description}</p>
        <span className="count">{verbs.length}</span>
      </div>
      <div className="zone-content">
        {verbs.map((verb) => (
          <DraggableVerb key={verb.id} verb={verb} />
        ))}
      </div>
      
      <style>{`
        .droppable-zone {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          min-width: 200px;
          height: 100%;
          overflow: hidden;
        }
        .zone-header {
          padding: 15px;
          border-bottom: 1px solid var(--color-border);
          position: relative;
        }
        .zone-header h3 {
          margin: 0;
          font-size: 16px;
        }
        .zone-header .description {
          margin: 5px 0 0 0;
          font-size: 12px;
          color: #64748b;
        }
        .zone-header .count {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: bold;
        }
        .zone-content {
          flex: 1;
          padding: 15px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-content: flex-start;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};
