import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Verb, Category } from '../types';
import { saveState, loadState } from '../lib/storage';

export function useAppState() {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial load
  useEffect(() => {
    async function init() {
      const savedState = await loadState();
      if (savedState && savedState.verbs) {
        setVerbs(savedState.verbs);
      }
      setIsLoaded(true);
    }
    init();
  }, []);

  // Save on change
  useEffect(() => {
    if (isLoaded) {
      saveState({ verbs });
    }
  }, [verbs, isLoaded]);

  const addVerb = useCallback((text: string, category: Category = 'UNCLASSIFIED') => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setVerbs(prev => [
      ...prev,
      { id: uuidv4(), text: trimmed, category }
    ]);
  }, []);

  const removeVerb = useCallback((id: string) => {
    setVerbs(prev => prev.filter(v => v.id !== id));
  }, []);

  const updateVerbCategory = useCallback((id: string, category: Category) => {
    setVerbs(prev => prev.map(v => v.id === id ? { ...v, category } : v));
  }, []);

  const clearAll = useCallback(() => {
    if (confirm('全てのデータを消去しますか？')) {
      setVerbs([]);
    }
  }, []);

  return {
    verbs,
    isLoaded,
    addVerb,
    removeVerb,
    updateVerbCategory,
    clearAll
  };
}
