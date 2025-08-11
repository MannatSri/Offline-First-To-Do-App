import { useEffect, useRef, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

import { Task, Op } from '../../types';
import * as storage from '../utils/storage';
import * as api from '../api';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const isOnlineRef = useRef<boolean>(false);
  const syncingRef = useRef(false);

  useEffect(() => {
    (async () => {
      const loaded = await storage.loadTasks();
      setTasks(loaded);
    })();

    const unsub = NetInfo.addEventListener(state => {
      const online = !!state.isConnected && !!state.isInternetReachable;
      isOnlineRef.current = online;
      if (online) triggerSyncIfNeeded();
    });

    return () => unsub();
  }, []);

  const pushOp = async (op: Op) => {
    const ops = await storage.loadOps();
    ops.push(op);
    await storage.saveOps(ops);
  };

  const persistTasks = async (next: Task[]) => {
    setTasks(next);
    await storage.saveTasks(next);
  };

  const addTask = async (title: string, description?: string) => {
    const t: Task = {
      localId: Math.random().toString(),
      title,
      description,
      completed: false,
      updatedAt: Date.now(),
      synced: false,
    };
    const next = [t, ...tasks];
    await persistTasks(next);
    await pushOp({ type: 'create', task: t });
    if (isOnlineRef.current) triggerSyncIfNeeded();
  };

  const updateTask = async (localId: string, patch: Partial<Task>) => {
    const next = tasks.map(t =>
      t.localId === localId
        ? { ...t, ...patch, updatedAt: Date.now(), synced: false }
        : t,
    );
    await persistTasks(next);
    const t = next.find(x => x.localId === localId)!;
    await pushOp({ type: 'update', task: t });
    if (isOnlineRef.current) triggerSyncIfNeeded();
  };

  const deleteTask = async (localId: string) => {
    const t = tasks.find(x => x.localId === localId);
    const next = tasks.filter(x => x.localId !== localId);
    await persistTasks(next);
    await pushOp({ type: 'delete', localId, serverId: t?.serverId });
    if (isOnlineRef.current) triggerSyncIfNeeded();
  };

  const triggerSyncIfNeeded = async () => {
    if (syncingRef.current) return;
    syncingRef.current = true;
    setIsSyncing(true);
    try {
      let ops = await storage.loadOps();
      while (ops.length > 0) {
        const op = ops.shift() as Op;
        try {
          if (op.type === 'create') {
            const { title, completed } = op.task;
            const res = await api.apiCreate({ title, completed });
            const serverId = res?.id;
            const currentTasks = await storage.loadTasks();
            const updated = currentTasks.map(t =>
              t.localId === op.task.localId
                ? { ...t, serverId, synced: true }
                : t,
            );
            await storage.saveTasks(updated);
            setTasks(updated);
          } else if (op.type === 'update') {
            const t = op.task;
            if (t.serverId) {
              await api.apiUpdate(t.serverId, {
                title: t.title,
                completed: t.completed,
              });
              const current = await storage.loadTasks();
              const updated = current.map(x =>
                x.localId === t.localId ? { ...x, synced: true } : x,
              );
              await storage.saveTasks(updated);
              setTasks(updated);
            } else {
              const res = await api.apiCreate({
                title: t.title,
                completed: t.completed,
              });
              const serverId = res?.id;
              const current = await storage.loadTasks();
              const updated = current.map(x =>
                x.localId === t.localId ? { ...x, serverId, synced: true } : x,
              );
              await storage.saveTasks(updated);
              setTasks(updated);
            }
          } else if (op.type === 'delete') {
            if (op.serverId) {
              await api.apiDelete(op.serverId);
            }
            const current = await storage.loadTasks();
            const updated = current.filter(x => x.localId !== op.localId);
            await storage.saveTasks(updated);
            setTasks(updated);
          }
        } catch (err) {
          ops.unshift(op);
          break;
        }
      }
      await storage.saveOps(ops);
    } finally {
      syncingRef.current = false;
      setIsSyncing(false);
    }
  };

  return {
    tasks,
    isSyncing,
    addTask,
    updateTask,
    deleteTask,
    triggerSyncIfNeeded,
  };
};
