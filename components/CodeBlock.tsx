import styles from './CodeBlock.module.scss';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  return (
    <div className={styles.wrapper}>
      {(filename || language) && (
        <div className={styles.header}>
          {filename && <span className={styles.filename}>{filename}</span>}
          {language && <span className={styles.language}>{language}</span>}
        </div>
      )}
      <pre className={styles.pre}>
        <code className={styles.code}>{code}</code>
      </pre>
    </div>
  );
}
