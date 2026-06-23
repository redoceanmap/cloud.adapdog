import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import AdminDashboard from './admin/AdminDashboard';
import { PasswordResetPage } from './components/auth/PasswordResetPage';
import './index.css';
import { initTheme } from './utils/theme';

initTheme();

function getPasswordResetToken(): string | null {
  if (window.location.pathname !== '/reset-password') return null;
  return new URLSearchParams(window.location.search).get('token');
}

function isAdminRoute(): boolean {
  return window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/');
}

const resetToken = getPasswordResetToken();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {resetToken ? (
      <PasswordResetPage token={resetToken} />
    ) : isAdminRoute() ? (
      <AdminDashboard />
    ) : (
      <App />
    )}
  </StrictMode>,
);
