import { writeTextFile, readTextFile, exists, BaseDirectory } from '@tauri-apps/plugin-fs';
import type { AppState } from '../types';

const SAVE_FILE_NAME = 'tcl-analysis-state.json';

export async function saveState(state: AppState): Promise<void> {
  try {
    const content = JSON.stringify(state, null, 2);
    // Ensure the app data directory exists (Tauri v2 uses BaseDirectory enum)
    await writeTextFile(SAVE_FILE_NAME, content, {
      baseDir: BaseDirectory.AppData,
    });
  } catch (error) {
    console.error('Failed to save state:', error);
  }
}

export async function loadState(): Promise<AppState | null> {
  try {
    const isFileExists = await exists(SAVE_FILE_NAME, {
      baseDir: BaseDirectory.AppData,
    });
    
    if (!isFileExists) return null;

    const content = await readTextFile(SAVE_FILE_NAME, {
      baseDir: BaseDirectory.AppData,
    });
    return JSON.parse(content) as AppState;
  } catch (error) {
    console.error('Failed to load state:', error);
    return null;
  }
}
