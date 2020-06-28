import { createContext, Reducer } from 'react';
import { ActionTypes } from './TodoActions';
import { Todo } from '../../models/TodoModel';

interface State {
  todos: Todo[];
}

export const INITIAL_STATE: State = {
  todos: [],
};

export interface Action {
  type: ActionTypes;
  payload?: any;
}

export const TodoStateContext = createContext<{
  state: State;
  dispatch: (action: Action) => void;
}>({ state: INITIAL_STATE, dispatch: () => {} });

export const todoReducer: Reducer<State, Action> = (state, action) => {
  const { type } = action;
  switch (type) {
    case ActionTypes.ADD:
      // const lastId = state.todos[0].id;
      return {
        todos: [
          { id: action.payload.id, title: action.payload.title, done: false },
          ...state.todos,
        ],
      };
    case ActionTypes.REMOVE:
      const removeIndex = state.todos.findIndex(
        (todo) => todo.id === action.payload.id,
      );
      return {
        todos: [
          ...state.todos.slice(0, removeIndex),
          ...state.todos.slice(removeIndex + 1),
        ],
      };
    case ActionTypes.DONE:
      const doneIndex = state.todos.findIndex(
        (todo) => todo.id === action.payload.id,
      );
      return {
        todos: [
          ...state.todos.slice(0, doneIndex),
          {
            id: state.todos[doneIndex].id,
            title: state.todos[doneIndex].title,
            done: !state.todos[doneIndex].done,
          },
          ...state.todos.slice(doneIndex + 1),
        ],
      };
    case ActionTypes.SYNC:
      return { todos: action.payload.todo };
    default:
      return state;
  }
};
