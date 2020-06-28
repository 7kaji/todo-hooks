import React, { useState, useRef, useContext, useCallback } from 'react';
import { TodoStateContext } from '../../contexts/Todo/TodoStore';
import { addAction } from '../../contexts/Todo/TodoActions';
import useFetch from 'use-http';

const TodoForm: React.FC = () => {
  const [value, setValue] = useState('');
  // eslint-disable-next-line
  const { state, dispatch } = useContext(TodoStateContext);
  const inputEl = useRef<HTMLInputElement>(null);
  const { post, response, loading, error } = useFetch();

  const postTodo = useCallback(
    async (value: string) => {
      await post('/todos', { title: value });
      if (response.ok) dispatch(addAction(response.data.id, value));
    },
    [dispatch, response, post],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (value === '') return;
      postTodo(value);
      setValue('');
      if (inputEl && inputEl.current) {
        inputEl.current.focus();
      }
    },
    [value, postTodo],
  );

  return (
    <div>
      {error && error.message}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          ref={inputEl}
        />
        <button type="submit" color="primary">
          {loading && 'Adding...'}
          Add
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
