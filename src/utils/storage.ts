import AsyncStorage from '@react-native-async-storage/async-storage';
import { TASKS_KEY, OPS_KEY, Task, Op } from '../../types';

export const loadTasks = async (): Promise<Task[]> => {
  const raw = await AsyncStorage.getItem(TASKS_KEY);
  return raw ? (JSON.parse(raw) as Task[]) : [];
};

export const saveTasks = async (tasks: Task[]) => {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const loadOps = async (): Promise<Op[]> => {
  const raw = await AsyncStorage.getItem(OPS_KEY);
  return raw ? (JSON.parse(raw) as Op[]) : [];
};

export const saveOps = async (ops: Op[]) => {
  await AsyncStorage.setItem(OPS_KEY, JSON.stringify(ops));
};
