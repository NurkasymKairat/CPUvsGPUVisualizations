import { BenchmarkChart } from '@/components/BenchmarkChart';
import { Section } from '@/components/Section';
import { Stat } from '@/components/Stat';
import { mandelbrotData, mandelbrotMeta } from '@/data/mandelbrot';
import { dotProductData, dotProductMeta } from '@/data/dotproduct';
import { heatData, heatMeta } from '@/data/heat';
import styles from './page.module.scss';

const crossovers = [
  {
    id: 'mandelbrot',
    meta: mandelbrotMeta,
    data: mandelbrotData,
    cpuVictoryUntil: 'never',
    crossoverSize: '< 512',
    note: 'Mandelbrot has no crossover in our measured range — the GPU wins from the first data point. To see a CPU win you would need to drop below ~256×256, where kernel-launch overhead dominates.',
  },
  {
    id: 'dotproduct',
    meta: dotProductMeta,
    data: dotProductData,
    cpuVictoryUntil: '~1M',
    crossoverSize: '~5M',
    note: 'Below ~1M elements the single-threaded CPU is actually competitive — host↔device transfer eats the GPU advantage. The naive GPU kernel only catches OpenMP around 10M elements; the optimized kernel crosses earlier, around 5M.',
  },
  {
    id: 'heat',
    meta: heatMeta,
    data: heatData,
    cpuVictoryUntil: '~256',
    crossoverSize: '~256',
    note: 'The stencil hands the GPU a clear win once the grid hits 512×512. At 256×256 OpenMP is within 1.5× of the naive GPU because the working set fits comfortably in L2.',
  },
];

export default function CrossoverPage() {
  return (
    <>
      <section className={styles.intro}>
        <div className={styles.introInner}>
          <span className={styles.eyebrow}>Crossover analysis</span>
          <h1 className={styles.title}>Where does the GPU start winning?</h1>
          <p className={styles.description}>
            A crossover point is the input size at which the GPU implementation becomes faster
            than the best CPU implementation. Below the crossover, the CPU wins because
            kernel-launch overhead and host↔device memory transfer cost more than the actual
            computation. Above it, raw parallelism dominates.
          </p>
          <p className={styles.description}>
            The crossover point is the single most useful number for deciding{' '}
            <em>whether</em> to port a workload to the GPU at all.
          </p>
        </div>
      </section>

      <Section eyebrow="At a glance" title="Crossover summary" bordered>
        <div className={styles.statsGrid}>
          <Stat
            value="< 512"
            label="Mandelbrot crossover"
            caption="GPU wins across the entire measured range"
            trend="up"
          />
          <Stat
            value="~5M"
            label="Dot product crossover"
            caption="Optimized GPU overtakes 8-core OpenMP"
            trend="up"
          />
          <Stat
            value="~256"
            label="Heat equation crossover"
            caption="Tiled GPU pulls ahead at 512×512 and never looks back"
            trend="up"
          />
        </div>
      </Section>

      {crossovers.map((c, idx) => (
        <section
          key={c.id}
          id={c.id}
          className={`${styles.section} ${idx > 0 ? styles.bordered : ''}`}
        >
          <div className={styles.sectionInner}>
            <header className={styles.sectionHeader}>
              <span className={styles.pattern}>{c.meta.pattern}</span>
              <h2 className={styles.sectionTitle}>{c.meta.title}</h2>
              <dl className={styles.markers}>
                <div className={styles.marker}>
                  <dt>CPU wins until</dt>
                  <dd>{c.cpuVictoryUntil}</dd>
                </div>
                <div className={styles.marker}>
                  <dt>Crossover at</dt>
                  <dd>{c.crossoverSize}</dd>
                </div>
              </dl>
            </header>

            <BenchmarkChart data={c.data} unit={c.meta.unit} xLabel={c.meta.xLabel} />

            <p className={styles.interpretation}>{c.note}</p>
          </div>
        </section>
      ))}

      <Section
        eyebrow="Takeaway"
        title="Three rules of thumb"
        description="Not every workload is worth porting. The crossover analysis gives a practical filter."
        bordered
      >
        <ol className={styles.rules}>
          <li>
            <span className={styles.ruleNum}>01</span>
            <div>
              <h3>Embarrassingly parallel: port it</h3>
              <p>
                If your problem looks like Mandelbrot — independent threads, no shared state —
                the GPU wins at almost every size. The launch overhead is the only floor.
              </p>
            </div>
          </li>
          <li>
            <span className={styles.ruleNum}>02</span>
            <div>
              <h3>Reductions: only at scale</h3>
              <p>
                The dot-product crossover sits in the millions of elements. Below that, the
                transfer cost dominates and you are better off on a multi-core CPU.
              </p>
            </div>
          </li>
          <li>
            <span className={styles.ruleNum}>03</span>
            <div>
              <h3>Stencils: optimize before you compare</h3>
              <p>
                A naive stencil kernel looks unimpressive. Shared-memory tiling is what
                separates a 3× speedup from a 30× speedup — measure the optimized version when
                deciding whether to port.
              </p>
            </div>
          </li>
        </ol>
      </Section>
    </>
  );
}
