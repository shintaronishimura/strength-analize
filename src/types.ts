export type Category = 'UNCLASSIFIED' | 'T' | 'C' | 'L';

export interface Verb {
  id: string;
  text: string;
  category: Category;
}

export interface AppState {
  verbs: Verb[];
}
