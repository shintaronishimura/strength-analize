import React, { useState, useMemo } from 'react';
import { Plus, Trash2, X, BookOpen, Pencil, Search } from 'lucide-react';
import type { Category, Verb } from '../types';
import { verbReference } from '../data/verbReference';

type InputMode = 'manual' | 'reference';

interface Props {
  verbs: Verb[];
  addVerb: (text: string, category?: Category) => void;
  removeVerb: (id: string) => void;
  clearAll: () => void;
}

export const InputPhase: React.FC<Props> = ({ verbs, addVerb, removeVerb, clearAll }) => {
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState<InputMode>('reference');
  const [searchQuery, setSearchQuery] = useState('');

  const addedTexts = useMemo(() => new Set(verbs.map(v => v.text)), [verbs]);

  const filteredReference = useMemo(() => {
    return verbReference.filter(rv => {
      if (addedTexts.has(rv.text)) return false;
      if (searchQuery && !rv.text.includes(searchQuery)) return false;
      return true;
    });
  }, [searchQuery, addedTexts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addVerb(inputValue);
      setInputValue('');
    }
  };

  const handleAddFromReference = (text: string, category: Category) => {
    addVerb(text, category);
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

      {/* Mode toggle */}
      <div className="mode-toggle">
        <button
          className={`mode-btn ${mode === 'reference' ? 'active' : ''}`}
          onClick={() => setMode('reference')}
        >
          <BookOpen size={16} />
          参照入力
        </button>
        <button
          className={`mode-btn ${mode === 'manual' ? 'active' : ''}`}
          onClick={() => setMode('manual')}
        >
          <Pencil size={16} />
          手入力
        </button>
      </div>

      {/* Manual input */}
      {mode === 'manual' && (
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
      )}

      {/* Reference input */}
      {mode === 'reference' && (
        <div className="reference-panel">
          <div className="reference-controls">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="動詞を検索..."
              />
            </div>
          </div>
          <div className="reference-count">
            {filteredReference.length}件の候補
          </div>
          <div className="reference-grid">
            {filteredReference.map(rv => (
              <button
                key={rv.text}
                className="reference-item"
                onClick={() => handleAddFromReference(rv.text, rv.category)}
              >
                {rv.text}
              </button>
            ))}
          </div>
        </div>
      )}

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

        /* Mode toggle */
        .mode-toggle {
          display: flex;
          gap: 8px;
        }
        .mode-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 2px solid var(--color-border);
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 14px;
          color: #64748b;
          transition: all 0.2s;
        }
        .mode-btn.active {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
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

        /* Reference panel */
        .reference-panel {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 320px;
        }
        .reference-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          min-width: 180px;
          padding: 8px 12px;
          border: 2px solid var(--color-border);
          border-radius: 6px;
          color: #64748b;
        }
        .search-box input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
        }
        .reference-count {
          font-size: 13px;
          color: #94a3b8;
        }
        .reference-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 8px;
          overflow-y: auto;
          flex: 1;
        }
        .reference-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: #f8fafc;
          cursor: pointer;
          font-size: 14px;
          text-align: left;
          transition: all 0.15s;
        }
        .reference-item:hover {
          background: #e2e8f0;
          border-color: #cbd5e1;
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
