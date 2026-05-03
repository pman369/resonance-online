import { supabase } from '../lib/supabase';

export interface QueuedAction {
  id: string;
  type: 'JOURNAL_ENTRY' | 'NOTE' | 'SYNC_REQUEST';
  data: any;
  timestamp: number;
}

const OFFLINE_QUEUE_KEY = 'resonance_offline_queue';

export const getOfflineQueue = (): QueuedAction[] => {
  const queue = localStorage.getItem(OFFLINE_QUEUE_KEY);
  return queue ? JSON.parse(queue) : [];
};

export const addToOfflineQueue = (type: QueuedAction['type'], data: any) => {
  const queue = getOfflineQueue();
  const newAction: QueuedAction = {
    id: crypto.randomUUID(),
    type,
    data,
    timestamp: Date.now(),
  };
  queue.push(newAction);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  console.log(`Action queued for offline sync: ${type}`, newAction);
};

export const clearOfflineQueue = () => {
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
};

export const syncOfflineActions = async () => {
  const queue = getOfflineQueue();
  if (queue.length === 0) return;

  console.log(`Starting sync for ${queue.length} offline actions...`);

  const remainingActions: QueuedAction[] = [];

  for (const action of queue) {
    try {
      if (action.type === 'JOURNAL_ENTRY') {
        // Handle journal entry sync if needed
        // For now, we'll just log it. Real implementation would call Supabase
      } else if (action.type === 'NOTE') {
        const { error } = await supabase.from('notes').insert([action.data]);
        if (error) throw error;
      }
      console.log(`Successfully synced action: ${action.id}`);
    } catch (err) {
      console.error(`Failed to sync action: ${action.id}`, err);
      remainingActions.push(action);
    }
  }

  if (remainingActions.length === 0) {
    clearOfflineQueue();
  } else {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remainingActions));
  }
};
