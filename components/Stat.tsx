import styles from './Stat.module.scss';

interface StatProps {
  value: string;
  label: string;
  caption?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function Stat({ value, label, caption, trend = 'neutral' }: StatProps) {
  return (
    <div className={styles.stat}>
      <div className={`${styles.value} ${styles[trend]}`}>{value}</div>
      <div className={styles.label}>{label}</div>
      {caption && <div className={styles.caption}>{caption}</div>}
    </div>
  );
}
