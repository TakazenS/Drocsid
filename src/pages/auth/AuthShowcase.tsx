import styles from './Auth.module.css';

interface AuthShowcaseProps {
  tagline: string;
}

export default function AuthShowcase({ tagline }: AuthShowcaseProps) {
  return (
    <aside className={styles.showcase} aria-hidden="true">
      <p className={`${styles.bubble} ${styles.yellow}`}>Game night at 9 ?</p>
      <p className={`${styles.bubble} ${styles.white}`}>I'm in !</p>
      <p className={`${styles.bubble} ${styles.orange}`}>Who brings snacks ? 🍕</p>
      <p className={`${styles.bubble} ${styles.blue}`}>Me 👋</p>
      <p className={styles.tagline}>{tagline}</p>
    </aside>
  );
}
