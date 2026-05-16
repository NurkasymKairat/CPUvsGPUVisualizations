import { CpuModel } from './CpuModel';
import styles from './CpuSection.module.scss';

const bullets = [
  'Out-of-order, speculative, branch-prediction heavy.',
  'Wins when the next computation depends on the last one.',
  'Our OpenMP runs use all 16 threads; baseline uses one.',
];

const stats = [
  { value: '8/16', label: 'cores / threads' },
  { value: '5.4', label: 'GHz boost' },
  { value: '36 MB', label: 'L3 cache' },
];

export function CpuSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <span className={styles.eyebrow}>The serial side · CPU</span>
        <h2 className={styles.heading}>
          Fewer cores, <span className={styles.accent}>deeper pipelines</span>.
        </h2>
        <p className={styles.lede}>
          The CPU side of every speedup number on this site. Same composition the GPU gets in
          the hero, mirrored — model on the left so the two chips face each other across the
          page.
        </p>

        <div className={styles.grid}>
          <div className={styles.modelCard}>
            <CpuModel />
          </div>

          <div className={styles.copy}>
            <h3 className={styles.copyHeading}>Built to chase the next instruction</h3>
            <ul className={styles.bullets}>
              {bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className={styles.stats}>
              {stats.map((s) => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
