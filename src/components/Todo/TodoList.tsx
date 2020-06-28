import React, { useEffect, useCallback, useContext } from 'react';
import { TodoStateContext } from '../../contexts/Todo/TodoStore';
import {
  syncAction,
  removeAction,
  doneAction,
} from '../../contexts/Todo/TodoActions';
import useFetch from 'use-http';

const TodoList: React.FC = () => {
  const { state, dispatch } = useContext(TodoStateContext);
  const { get, patch, request, response, loading, error } = useFetch();

  const getTodo = useCallback(async () => {
    const todos = await get('/todos');
    if (response.ok) dispatch(syncAction(todos));
  }, [dispatch, get, response]);

  useEffect(() => {
    getTodo();
  }, [getTodo]);

  const doneTodo = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      id: number,
      done: boolean,
    ) => {
      const doneValue = done ? 1 : 0;
      await patch(`/todos/${id}`, { done: doneValue });
      if (response.ok) dispatch(doneAction(id));
    },
    [dispatch, patch, response],
  );

  const deleteTodo = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
      await request.delete(`/todos/${id}`);
      if (response.ok) dispatch(removeAction(id));
    },
    [dispatch, request, response],
  );

  return (
    <>
      {error && error.message}
      {loading && 'Loading...'}
      <table>
        <tbody>
          {state.todos.length > 0 &&
            state.todos.map((todo) => (
              <tr key={todo.id}>
                <th style={{ textDecoration: todo.done ? 'line-through' : '' }}>
                  {todo.id} :{todo.title}
                </th>
                <td className="text-right">
                  <button
                    className="mr-2"
                    color={todo.done ? 'success' : 'secondary'}
                    onClick={(e) => doneTodo(e, todo.id, !todo.done)}
                  >
                    {todo.done ? '✔' : '-'}
                  </button>
                  <button
                    color="danger"
                    onClick={(e) => deleteTodo(e, todo.id)}
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default TodoList;
