import './App.css';
import { createBrowserRouter, RouterProvider, Link,Routes, Router } from "react-router-dom";
import LoginRegister from './components/Auth/LoginRegister';
import TaskBoard from './components/Task/TaskBoard';

const router = createBrowserRouter([
  { path: "/", element: <LoginRegister /> },
  { path: "/taskBoard", element: <TaskBoard /> },

 
]);

function App() {
  return (
    <RouterProvider router={router}>
    </RouterProvider>
  );
}

export default App;
