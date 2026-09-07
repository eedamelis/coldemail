import { DraftState, PitchRecord } from '../types';

const DB_NAME = 'pitchhook_db';
const DB_VERSION = 1;
const DRAFT_STORE = 'draft_store';
const HISTORY_STORE = 'history_store';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(DRAFT_STORE)) {
        db.createObjectStore(DRAFT_STORE);
      }
      if (!db.objectStoreNames.contains(HISTORY_STORE)) {
        const historyStore = db.createObjectStore(HISTORY_STORE, { keyPath: 'id' });
        historyStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Fallback keys in case IndexedDB fails or is in restricted private mode
const LOCAL_STORAGE_DRAFT_KEY = 'pitchhook_fallback_draft';
const LOCAL_STORAGE_HISTORY_KEY = 'pitchhook_fallback_history';

export async function saveDraftState(draft: DraftState): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DRAFT_STORE, 'readwrite');
      const store = tx.objectStore(DRAFT_STORE);
      const req = store.put(draft, 'current_draft');
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      localStorage.setItem(LOCAL_STORAGE_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }
}

export async function loadDraftState(): Promise<DraftState | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DRAFT_STORE, 'readonly');
      const store = tx.objectStore(DRAFT_STORE);
      const req = store.get('current_draft');
      req.onsuccess = () => resolve((req.result as DraftState) || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY);
      return raw ? (JSON.parse(raw) as DraftState) : null;
    } catch {
      return null;
    }
  }
}

export async function savePitchRecord(record: PitchRecord): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(HISTORY_STORE, 'readwrite');
      const store = tx.objectStore(HISTORY_STORE);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      const list: PitchRecord[] = raw ? JSON.parse(raw) : [];
      const updated = [record, ...list.filter((r) => r.id !== record.id)].slice(0, 30);
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
}

export async function loadAllPitchRecords(): Promise<PitchRecord[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(HISTORY_STORE, 'readonly');
      const store = tx.objectStore(HISTORY_STORE);
      const req = store.getAll();
      req.onsuccess = () => {
        const records = (req.result as PitchRecord[]) || [];
        records.sort((a, b) => b.createdAt - a.createdAt);
        resolve(records);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      return raw ? (JSON.parse(raw) as PitchRecord[]) : [];
    } catch {
      return [];
    }
  }
}

export async function deletePitchRecord(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(HISTORY_STORE, 'readwrite');
      const store = tx.objectStore(HISTORY_STORE);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (raw) {
        const list: PitchRecord[] = JSON.parse(raw);
        const filtered = list.filter((r) => r.id !== id);
        localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(filtered));
      }
    } catch {
      // ignore
    }
  }
}

export async function clearAllPitchRecords(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(HISTORY_STORE, 'readwrite');
      const store = tx.objectStore(HISTORY_STORE);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
    } catch {
      // ignore
    }
  }
}
