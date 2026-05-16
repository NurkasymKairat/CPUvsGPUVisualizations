import { ReactNode } from 'react';
import styles from './Section.module.scss';

interface SectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  id?: string;
  bordered?: boolean;
}

export function Section({ eyebrow, title, description, children, id, bordered = false }: SectionProps) {
  return (
    <section id={id} className={`${styles.section} ${bordered ? styles.bordered : ''}`}>
      <div className={styles.container}>
        {(eyebrow || title || description) && (
          <header className={styles.header}>
            {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </header>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}
