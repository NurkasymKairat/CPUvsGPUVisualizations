'use client';

import type { BenchmarkPoint } from '@/data/mandelbrot';
import styles from './SpeedRace.module.scss';

interface SpeedRaceProps {
  data: BenchmarkPoint;
  title: string;
}

type RowKey = 'cpuNaive' | 'cpuOmp' | 'cpuAvx2' | 'gpuNaive' | 'gpuOptimized';

const ROWS: { key: RowKey; label: string; tone: string }[] = [
  { key: 'cpuNaive',     label: 'CPU naive',     tone: styles.toneCpuLight },
  { key: 'cpuOmp',       label: 'CPU OpenMP',    tone: styles.toneCpuMid },
  { key: 'cpuAvx2',      label: 'CPU AVX2',      tone: styles.toneCpuDark },
  { key: 'gpuNaive',     label: 'GPU naive',     tone: styles.toneGpuDark },
  { key: 'gpuOptimized', label: 'GPU optimized', tone: styles.toneGpu },
];

function formatMs(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(2)} s`;
  if (n >= 1) return `${n.toFixed(2)} ms`;
  return `${(n * 1000).toFixed(0)} µs`;
}

export function SpeedRace({ data, title }: SpeedRaceProps) {
  const times = ROWS.map((r) => data[r.key]);
  const valid = times.filter((t): t is number => typeof t === 'number');
  const max = valid.length ? Math.max(...valid) : 1;
  const min = valid.length ? Math.min(...valid) : 0;
  const haveDistinct = valid.length > 1 && max !== min;

  return (
    <div className={styles.race}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.legend}>longer bar = slower</span>
      </div>
      <ul className={styles.rows}>
        {ROWS.map((row, i) => {
          const t = times[i];
          if (typeof t !== 'number') {
            return (
              <li key={row.key} className={`${styles.row} ${styles.rowMissing}`}>
                <span className={styles.label}>{row.label}</span>
                <div className={styles.track}>
                  <span className={styles.notMeasured}>not measured</span>
                </div>
              </li>
            );
          }

          const isFastest = haveDistinct && t === min;
          const isSlowest = haveDistinct && t === max;
          const width = (t / max) * 100;

          const barClass = [
            styles.bar,
            row.tone,
            isFastest ? styles.fastest : '',
            isSlowest ? styles.slowest : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <li key={row.key} className={styles.row}>
              <span className={styles.label}>{row.label}</span>
              <div className={styles.track}>
                <div className={barClass} style={{ width: `${width}%` }} />
                <span className={styles.time}>{formatMs(t)}</span>
                {isFastest && <span className={styles.fastestTag}>Fastest</span>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
