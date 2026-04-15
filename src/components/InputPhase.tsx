import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import type { Verb } from '../types';

interface Props {
  verbs: Verb[];
  addVerb: (text: string) => void;
  removeVerb: (id: string) => void;
  clearAll: () => void;
}

export const InputPhase: React.FC<Props> = ({ verbs, addVerb, removeVerb, clearAll }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addVerb(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="input-phase">
      <div className="input-header">
        <h2>1. 好きな動詞を100個挙げる</h2>
        <p>あなたが「好きだ」「ワクワクする」と感じる動詞を書き出してください。</p>
        
        <div className="progress-container">
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${Math.min((verbs.length / 100) * 100, 100)}%` }}
            ></div>
          </div>
          <span>{verbs.length} / 100</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="verb-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="例: 分析する、教える、作る..."
          autoFocus
        />
        <button type="submit" className="primary">
          <Plus size={20} />
          追加
        </button>
      </form>

      <div className="verb-list-container">
        <div className="list-header">
          <h3>入力済みリスト ({verbs.length})</h3>
          {verbs.length > 0 && (
            <button onClick={clearAll} className="clear-btn">
              <Trash2 size={16} />
              全て消去
            </button>
          )}
        </div>
        
        <div className="verb-grid">
          {verbs.map((verb) => (
            <div key={verb.id} className={`verb-item ${verb.category}`}>
              <span>{verb.text}</span>
              <button onClick={() => removeVerb(verb.id)} className="remove-btn">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .input-phase {
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
        }
        .progress-container {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 10px;
        }
        .progress-bar-bg {
          flex: 1;
          height: 12px;
          background: #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--color-primary);
          transition: width 0.3s ease;
        }
        .verb-form {
          display: flex;
          gap: 10px;
        }
        .verb-form input {
          flex: 1;
          padding: 12px;
          border: 2px solid var(--color-border);
          border-radius: 6px;
          font-size: 16px;
        }
        .verb-form input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .verb-list-container {
          flex: 1;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow-y: auto;
        }
        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .clear-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          font-size: 14px;
        }
        .verb-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 10px;
        }
        .verb-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: #f1f5f9;
          border-radius: 4px;
          font-size: 14px;
        }
        .verb-item.T { background-color: var(--color-postit-t); }
        .verb-item.C { background-color: var(--color-postit-c); }
        .verb-item.L { background-color: var(--color-postit-l); }
        
        .remove-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }
        .remove-btn:hover {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
};
