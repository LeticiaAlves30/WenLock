import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/Home';
import { LoginPage } from '../pages/Login';
import { UserCreatePage } from '../pages/UserCreate';
import { UserEditPage } from '../pages/UserEdit';
import { UsersPage } from '../pages/Users';

export const routeDefinitions: RouteObject[] = [
  { path: 'login', element: <LoginPage /> },
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'users/new', element: <UserCreatePage /> },
      { path: 'users/:id/edit', element: <UserEditPage /> },
    ],
  },
];

export const router = createBrowserRouter(routeDefinitions);
