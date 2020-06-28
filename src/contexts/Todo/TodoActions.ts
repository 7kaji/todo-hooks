export enum ActionTypes {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  DONE = 'DONE',
  SYNC = 'SYNC',
}

export const addAction = (id: number, title: string) => ({
  type: ActionTypes.ADD,
  payload: { id, title },
});

export const removeAction = (id: number) => ({
  type: ActionTypes.REMOVE,
  payload: { id },
});

export const doneAction = (id: number) => ({
  type: ActionTypes.DONE,
  payload: { id },
});

export const syncAction = (todo: []) => ({
  type: ActionTypes.SYNC,
  payload: { todo },
});
