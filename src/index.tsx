import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import App from './App.tsx';
import Auth from './auth/Auth.tsx';
import AuthProvider from './auth/AuthProvider.tsx';
import Guest from './auth/Guest.tsx';
import LoginPage from './pages/auth/LoginPage.tsx';
import RegisterPage from './pages/auth/RegisterPage.tsx';
import ThemeProvider from './theme/ThemeProvider.tsx';

import '@fontsource-variable/plus-jakarta-sans';

import './index.css';

const router = createBrowserRouter([
  {
    element: <Auth />,
    children: [
      { path: '/', element: <App /> },
    ],
  },
  {
    element: <Guest />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
