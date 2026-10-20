import { useActionState } from 'react';
import { Link } from 'react-router';

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_RULES_MESSAGE,
} from '../../../shared/validations/password.ts';
import { useAuth } from '../../auth/useAuth.ts';
import ThemeToggle from '../../components/ThemeToggle.tsx';
import AuthShowcase from './AuthShowcase.tsx';

import styles from './Auth.module.css';

interface RegisterFormState {
  error: string | null;
  username: string;
  email: string;
}

export default function RegisterPage() {
  const { register } = useAuth();

  const [state, formAction, isPending] = useActionState<RegisterFormState, FormData>(
    async (_previous, formData) => {
      const username = String(formData.get('username') ?? '').trim();
      const email = String(formData.get('email') ?? '').trim();
      const password = String(formData.get('password') ?? '');
      const confirmPassword = String(formData.get('confirmPassword') ?? '');

      if (!PASSWORD_REGEX.test(password)) {
        return { error: PASSWORD_RULES_MESSAGE, username, email };
      }

      if (password !== confirmPassword) {
        return { error: 'The two passwords don\'t match.', username, email };
      }

      try {
        await register({ username, email, password });
        return { error: null, username, email };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Account creation failed. Try again.';
        return { error: message, username, email };
      }
    },
    { error: null, username: '', email: '' },
  );

  return (
    <main className={`${styles.page} grid-surface`}>
      <ThemeToggle />
      <div className={styles.window}>
        <AuthShowcase tagline="Start a server. Bring your people." />

        <form action={formAction} className={styles.form}>
          <p className={styles.brand}>Drocsid</p>
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>Pick a username your friends will recognize.</p>

          <label className={styles.field}>
            Username
            <input
              name="username"
              autoComplete="username"
              defaultValue={state.username}
              minLength={3}
              maxLength={32}
              pattern="[a-zA-Z0-9_.]+"
              required
            />
            <span className={styles.hint}>3 to 32 letters, numbers, dots or underscores.</span>
          </label>

          <label className={styles.field}>
            Email
            <input name="email" type="email" autoComplete="email" defaultValue={state.email} required />
          </label>

          <label className={styles.field}>
            Password
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={PASSWORD_MIN_LENGTH}
              maxLength={PASSWORD_MAX_LENGTH}
              required
            />
            <span className={styles.hint}>
              At least {PASSWORD_MIN_LENGTH} characters, with a lowercase letter, an uppercase letter and a special character.
            </span>
          </label>

          <label className={styles.field}>
            Confirm password
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={PASSWORD_MIN_LENGTH}
              maxLength={PASSWORD_MAX_LENGTH}
              required
            />
          </label>

          {state.error && <p className={styles.error} role="alert">{state.error}</p>}

          <button type="submit" className={styles.submit} disabled={isPending}>
            {isPending ? 'Creating account…' : 'Create account'}
          </button>

          <p className={styles.switch}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
