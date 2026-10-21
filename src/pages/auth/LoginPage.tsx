import { useActionState } from 'react';
import { Link } from 'react-router';

import { useAuth } from '../../hook/useAuth.ts';
import ThemeToggle from '../../components/ThemeToggle.tsx';
import AuthShowcase from './AuthShowcase.tsx';

import styles from './Auth.module.css';

interface LoginFormState {
  error: string | null;
  email: string;
}

export default function LoginPage() {
  const { login } = useAuth();

  const [state, formAction, isPending] = useActionState<LoginFormState, FormData>(
    async (_previous, formData) => {
      const email = String(formData.get('email') ?? '');
      const password = String(formData.get('password') ?? '');

      try {
        await login({ email, password });
        return { error: null, email };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed. Try again.';
        return { error: message, email };
      }
    },
    { error: null, email: '' },
  );

  return (
    <main className={`${styles.page} grid-surface`}>
      <ThemeToggle />
      <div className={styles.window}>
        <AuthShowcase tagline="Your people, one windows away." />

        <form action={formAction} className={styles.form}>
          <p className={styles.brand}>Drocsid</p>
          <h1 className={styles.title}>Sign in</h1>
          <p className={styles.subtitle}>Pick up your conversations where you left them.</p>

          <label className={styles.field}>
            Email
            <input name="email" type="email" autoComplete="email" defaultValue={state.email} required />
          </label>

          <label className={styles.field}>
            Password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>

          {state.error && <p className={styles.error} role="alert">{state.error}</p>}

          <button type="submit" className={styles.submit} disabled={isPending}>
            {isPending ? 'Signing in…' : 'Sign in'}
          </button>

          <p className={styles.switch}>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
