import { BenchmarkChart } from '@/components/BenchmarkChart';
import { Section } from '@/components/Section';
import { mandelbrotData, mandelbrotMeta } from '@/data/mandelbrot';
import { dotProductData, dotProductMeta } from '@/data/dotproduct';
import { heatData, heatMeta } from '@/data/heat';
import styles from './page.module.scss';

const benchmarks = [
  { id: 'mandelbrot', meta: mandelbrotMeta, data: mandelbrotData },
  { id: 'dotproduct', meta: dotProductMeta, data: dotProductData },
  { id: 'heat', meta: heatMeta, data: heatData },
];

export default function BenchmarksPage() {
  return (
    <>
      <section className={styles.intro}>
        <div className={styles.introInner}>
          <span className={styles.eyebrow}>Benchmarks</span>
          <h1 className={styles.title}>Three workloads, four implementations each</h1>
          <p className={styles.description}>
            All measurements are wall-clock time. CPU runs use a single Intel Core i7 thread and
            an OpenMP build on 8 cores. GPU runs use an NVIDIA RTX 3060. Both axes are
            logarithmic — slopes tell you scaling behavior, vertical gaps tell you raw speedup.
          </p>
        </div>
      </section>

      {benchmarks.map((b, idx) => (
        <section
          key={b.id}
          id={b.id}
          className={`${styles.benchmark} ${idx > 0 ? styles.bordered : ''}`}
        >
          <div className={styles.benchmarkInner}>
            <header className={styles.benchmarkHeader}>
              <span className={styles.pattern}>{b.meta.pattern}</span>
              <h2 className={styles.benchmarkTitle}>{b.meta.title}</h2>
              <p className={styles.benchmarkDesc}>{b.meta.description}</p>
            </header>

            <BenchmarkChart data={b.data} unit={b.meta.unit} xLabel={b.meta.xLabel} />

            <aside className={styles.insight}>
              <span className={styles.insightLabel}>Key insight</span>
              <p className={styles.insightText}>{b.meta.keyInsight}</p>
            </aside>
          </div>
        </section>
      ))}

      <Section eyebrow="Methodology" title="How we measured" bordered>
        <ul className={styles.methodList}>
          <li>
            <strong>Warm-up:</strong> Each kernel runs once before timing to amortize JIT
            compilation, GPU context init, and page faults.
          </li>
          <li>
            <strong>Repetitions:</strong> 10 runs per data point. We report the median.
          </li>
          <li>
            <strong>Transfer cost:</strong> GPU timings include host↔device memcpy. This is the
            honest number for a one-shot computation.
          </li>
          <li>
            <strong>Compiler:</strong> <code>g++ -O3 -fopenmp</code> for CPU,{' '}
            <code>nvcc -O3 -arch=sm_86</code> for GPU.
          </li>
        </ul>
      </Section>
    </>
  );
}
