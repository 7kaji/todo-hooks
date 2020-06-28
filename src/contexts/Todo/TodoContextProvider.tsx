import React, { useReducer, ReactNode } from 'react';
import { TodoStateContext, todoReducer, INITIAL_STATE } from './TodoStore';

type Props = {
  children: ReactNode;
};

const TodoContextProvider: React.FC<Props> = (props: Props) => {
  const [state, dispatch] = useReducer(todoReducer, INITIAL_STATE);
  return (
    <TodoStateContext.Provider value={{ state, dispatch }}>
      {props.children}
    </TodoStateContext.Provider>
  );
};

export default TodoContextProvider;
