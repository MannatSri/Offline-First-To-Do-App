const BASE = 'https://jsonplaceholder.typicode.com/todos';

export const apiCreate = async (task: {
  title: string;
  completed: boolean;
}) => {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: task.title, completed: task.completed }),
  });
  return res.json();
};

export const apiUpdate = async (
  id: number,
  payload: Partial<{ title: string; completed: boolean }>,
) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const apiDelete = async (id: number) => {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  return res.status === 200 || res.status === 204;
};
