# useQState - A Custom State Management Hook with TanStack Query

`useQState` is a custom React hook that simplifies state management by leveraging [TanStack Query](https://tanstack.com/query/latest). It offers an efficient way to manage both global and local state with automatic serialization of complex data types, all while taking advantage of TanStack Query's powerful caching capabilities.

## Features

- **Seamless State Management**: Manage state across your React application without additional state management libraries.
- **Performance Optimizations**: Benefit from TanStack Query's caching and performance features.
- **Intuitive API**: Familiar API similar to React's useState hook.

## Installation

First, ensure you have React, TanStack Query:

```bash
npm install @tanstack/react-query @acoboyz/react-qstate
```

## Setup
Before using useQState, you need to set up the QueryClient and wrap your application with the QueryClientProvider from TanStack Query.

```tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components go here */}
    </QueryClientProvider>
  );
}

export default App;
```

## Usage

#### Importing the Hook
```tsx
import { useQState } from '@acoboyz/react-qstate';
```

#### Basic Example
```tsx
import React from 'react';
import { useQState } from '@acoboyz/react-qstate';

function Counter() {
  const [count, setCount, resetCount] = useQState<number>(['counter'], 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
      <button onClick={resetCount}>Reset</button>
    </div>
  );
}
```

#### Managing Complex Data Types
`useQState` automatically serializes and deserializes complex data types like objects and arrays.

```tsx
import React from 'react';
import { useQState } from '@acoboyz/react-qstate';

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

function Profile() {
  const [user, setUser, resetUser] = useQState<UserProfile | null>(['userProfile'], null);

  const updateEmail = (email: string) => {
    setUser(prevUser => prevUser ? { ...prevUser, email } : null);
  };

  return (
    <div>
      {user ? (
        <>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <button onClick={() => updateEmail('newemail@example.com')}>Update Email</button>
        </>
      ) : (
        <p>No user data available.</p>
      )}
      <button onClick={resetUser}>Reset Profile</button>
    </div>
  );
}
```

#### Resetting State
You can reset the state to its initial value using the `resetState` function.

```tsx
const [state, setState, resetState] = useQState(['myStateKey'], initialValue);

// To reset the state
resetState();
```

## How It Works

The `useQState` hook uses TanStack Query to manage stateful data to serialize and deserialize complex data types. Here's a brief overview:

- **State Initialization**: When you first call `useQState`, it initializes the state with the provided `initialData`.
- **Caching**: TanStack Query caches the state data, allowing for efficient updates and retrievals.
- **State Updates**: Use the `setState` function to update the state. It supports both direct updates and updater functions (like React's `setState`).
- **State Reset**: The `resetState` function invalidates the query and resets the state to its initial value.

## Benefits

- **Global State Without Additional Libraries**: Manage global state without needing Redux or Context API.
- **Performance Optimizations**: Leverage TanStack Query's caching to minimize unnecessary re-renders and data fetching.
- **Simple API**: Designed to be as straightforward as React's built-in hooks.

## Example: Todo List

```tsx
import React from 'react';
import { useQState } from '@acoboyz/react-qstate';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function TodoApp() {
  const [todos, setTodos, resetTodos] = useQState<Todo[]>(['todos'], []);

  const addTodo = (text: string) => {
    setTodos(prevTodos => [...prevTodos, { id: Date.now(), text, completed: false }]);
  };

  const toggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  return (
    <div>
      <button onClick={() => addTodo('New Task')}>Add Todo</button>
      <button onClick={resetTodos}>Reset Todos</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{ textDecoration: todo.completed ? 'line-through' : undefined }}
            >
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Advanced Usage

### Using with Local Storage
If you want to persist state across browser sessions, you can integrate `localStorage`:

```tsx
import { useQState } from '@acoboyz/react-qstate';

function usePersistentState<T>(key: string, initialData: T) {
  const [state, setState, resetState] = useQState<T>([key], initialData);

  React.useEffect(() => {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      setState(JSON.parse(storedData));
    }
  }, [key, setState]);

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState, resetState] as const;
}
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests on the [GitHub repository](https://github.com/acoBOYZ/react-qstate).

## License

This project is licensed under the MIT License.

## Acknowledgments

- [TanStack Query](https://tanstack.com/query/latest) for powerful asynchronous state management.
  
##
By providing this hook, we aim to simplify state management in React applications, making it more efficient and developer-friendly. If you have any questions or need further assistance, please don’t hesitate to reach out.