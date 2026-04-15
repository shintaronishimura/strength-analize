import { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import { InputPhase } from './components/InputPhase';
import { ClassificationPhase } from './components/ClassificationPhase';
import { ResultsPhase } from './components/ResultsPhase';
import './App.css';

type Phase = 'INPUT' | 'CLASSIFICATION' | 'RESULTS';

function App() {
  const { 
    verbs, 
    isLoaded, 
    addVerb, 
    removeVerb, 
    updateVerbCategory, 
    clearAll 
  } = useAppState();
  
  const [currentPhase, setCurrentPhase] = useState<Phase>('INPUT');

  if (!isLoaded) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      <header>
        <h1>TCL Analysis</h1>
        <div className="tabs">
          <button 
            className={`tab ${currentPhase === 'INPUT' ? 'active' : ''}`}
            onClick={() => setCurrentPhase('INPUT')}
          >
            1. 入力
          </button>
          <button 
            className={`tab ${currentPhase === 'CLASSIFICATION' ? 'active' : ''}`}
            onClick={() => setCurrentPhase('CLASSIFICATION')}
          >
            2. 分類
          </button>
          <button 
            className={`tab ${currentPhase === 'RESULTS' ? 'active' : ''}`}
            onClick={() => setCurrentPhase('RESULTS')}
          >
            3. 結果
          </button>
        </div>
      </header>

      <main className="phase-content">
        {currentPhase === 'INPUT' && (
          <InputPhase 
            verbs={verbs} 
            addVerb={addVerb} 
            removeVerb={removeVerb}
            clearAll={clearAll}
          />
        )}
        {currentPhase === 'CLASSIFICATION' && (
          <ClassificationPhase 
            verbs={verbs} 
            updateVerbCategory={updateVerbCategory} 
          />
        )}
        {currentPhase === 'RESULTS' && (
          <ResultsPhase verbs={verbs} />
        )}
      </main>

      <style>{`
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 20px;
          color: #64748b;
        }
      `}</style>
    </div>
  );
}

export default App;
