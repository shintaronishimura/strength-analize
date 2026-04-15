import React from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { Category, Verb } from '../types';
import { DroppableZone } from './DroppableZone';

interface Props {
  verbs: Verb[];
  updateVerbCategory: (id: string, category: Category) => void;
}

export const ClassificationPhase: React.FC<Props> = ({ verbs, updateVerbCategory }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const verbId = active.id as string;
      const newCategory = over.id as Category;
      updateVerbCategory(verbId, newCategory);
    }
  };

  const zones: { id: Category; title: string; description: string }[] = [
    { id: 'UNCLASSIFIED', title: '未分類 (Inbox)', description: 'ここから各エリアへドラッグ' },
    { id: 'T', title: 'Thinking (T)', description: '考える力・戦略・分析' },
    { id: 'C', title: 'Communication (C)', description: '伝える力・共感・交渉' },
    { id: 'L', title: 'Leadership (L)', description: '巻き込む力・意思決定' },
  ];

  return (
    <div className="classification-phase">
      <div className="phase-header">
        <h2>2. 動詞をT・C・Lに分類する</h2>
        <p>リストアップした動詞を、自分の感覚で3つの資質に分類してください。迷ったら未分類のままでも構いません。</p>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="zones-container">
          {zones.map((zone) => (
            <DroppableZone
              key={zone.id}
              id={zone.id}
              title={zone.title}
              description={zone.description}
              verbs={verbs.filter((v) => v.category === zone.id)}
            />
          ))}
        </div>
      </DndContext>

      <style>{`
        .classification-phase {
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
        }
        .zones-container {
          flex: 1;
          display: flex;
          gap: 15px;
          overflow-x: auto;
          padding-bottom: 10px;
        }
      `}</style>
    </div>
  );
};
