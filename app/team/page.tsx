import { Section } from '@/components/Section';
import styles from './page.module.scss';

const team = [
  {
    name: 'Yersin',
    role: 'CPU Baselines',
    tech: 'C++ · OpenMP',
    contributions: [
      'Wrote the single-threaded reference implementations for all three workloads',
      'Built the OpenMP parallel-for versions and tuned scheduling policies',
      'Set up the timing harness with warm-up runs and median reporting',
    ],
  },
  {
    name: 'Kirill',
    role: 'Basic CUDA Kernels',
    tech: 'CUDA · C++',
    contributions: [
      'Authored the naive GPU kernels for Mandelbrot, dot product, and the heat stencil',
      'Set up host↔device memory transfer and grid/block size selection',
      'Verified correctness against the CPU baselines down to floating-point tolerance',
    ],
  },
  {
    name: 'Alan',
    role: 'GPU Optimizations',
    tech: 'CUDA · Shared memory',
    contributions: [
      'Rewrote the dot product with warp shuffles and a shared-memory tree reduction',
      'Implemented shared-memory tiling for the heat-equation stencil',
      'Tuned block sizes and occupancy with Nsight Compute',
    ],
  },
  {
    name: 'Zhanbolat',
    role: 'Profiling & Benchmarking',
    tech: 'Nsight · perf',
    contributions: [
      'Built the sweep script that runs every implementation across the size grid',
      'Profiled hotspots and produced the roofline charts for each kernel',
      'Validated GPU timings with CUDA events vs wall-clock to confirm the methodology',
    ],
  },
  {
    name: 'Kairat',
    role: 'Frontend & Visualization',
    tech: 'Next.js · TypeScript · Recharts',
    contributions: [
      'Built this site (Next.js 14 App Router + SASS modules)',
      'Designed the dark technical theme and log-log chart components',
      'Wrote the report copy and structured the crossover analysis',
    ],
  },
];

const aiTools = [
  {
    name: 'Claude Code',
    use: 'Scaffolded the Next.js report site, drafted CUDA kernel skeletons, and helped explain warp-level reduction patterns while we were tuning.',
  },
  {
    name: 'Cursor',
    use: 'In-editor refactors and tab-completion across the C++ baseline files. Used for renaming, splitting headers, and quick OpenMP pragma tweaks.',
  },
];

export default function TeamPage() {
  return (
    <>
      <section className={styles.intro}>
        <div className={styles.introInner}>
          <span className={styles.eyebrow}>Team</span>
          <h1 className={styles.title}>Five people, one report</h1>
          <p className={styles.description}>
            We split the work along architectural boundaries — one person owned the CPU
            baselines, two owned the GPU implementations (naive and optimized), one owned
            profiling, and one built this site. Every benchmark number on this site was
            produced by the team and reviewed by at least two people.
          </p>
        </div>
      </section>

      <Section eyebrow="Contributors" title="Who did what" bordered>
        <div className={styles.grid}>
          {team.map((member) => (
            <article key={member.name} className={styles.card}>
              <header className={styles.cardHeader}>
                <h3 className={styles.name}>{member.name}</h3>
                <span className={styles.role}>{member.role}</span>
                <span className={styles.tech}>{member.tech}</span>
              </header>
              <ul className={styles.contributions}>
                {member.contributions.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Disclosure"
        title="AI tools we used"
        description="A short, honest account of where AI assistance helped — and where it didn't."
        bordered
      >
        <div className={styles.aiGrid}>
          {aiTools.map((tool) => (
            <div key={tool.name} className={styles.aiCard}>
              <div className={styles.aiName}>{tool.name}</div>
              <p className={styles.aiUse}>{tool.use}</p>
            </div>
          ))}
        </div>
        <p className={styles.disclosure}>
          Every measurement reported on this site comes from code we wrote and ran ourselves.
          AI tools were used for scaffolding, explanation, and iteration — never for
          generating benchmark numbers.
        </p>
      </Section>
    </>
  );
}
