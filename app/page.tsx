import Link from 'next/link';
import { Section } from '@/components/Section';
import { Stat } from '@/components/Stat';
import { HeroDiagonal } from '@/components/HeroDiagonal';
import { CpuSection } from '@/components/CpuSection';
import styles from './page.module.scss';

const tasks = [
  {
    title: 'Mandelbrot',
    pattern: 'Embarrassingly parallel',
    description:
      'Per-pixel iteration with no data dependencies. The cleanest possible win for GPUs — every thread runs the same kernel on independent data.',
    href: '/benchmarks#mandelbrot',
    badge: '01',
  },
  {
    title: 'Dot Product',
    pattern: 'Reduction',
    description:
      'Element-wise multiply followed by a global sum. Forces a tree-style merge — naive GPU code lags until you use warp-level primitives.',
    href: '/benchmarks#dotproduct',
    badge: '02',
  },
  {
    title: 'Heat Equation',
    pattern: 'Stencil',
    description:
      'Each cell reads four neighbors per step. Memory-bound; shared-memory tiling is what unlocks the GPU here.',
    href: '/benchmarks#heat',
    badge: '03',
  },
];

const stack = [
  { name: 'CUDA', detail: 'GPU kernels, shared memory, warp shuffles' },
  { name: 'OpenMP', detail: 'CPU parallel-for baselines on 8 cores' },
  { name: 'C++17', detail: 'Both CPU and GPU host code' },
  { name: 'Next.js 14', detail: 'App Router + TypeScript for this report' },
  { name: 'Recharts', detail: 'Log-log timing plots' },
];

export default function HomePage() {
  return (
    <>
      <HeroDiagonal />

      <Section
        eyebrow="Workloads"
        title="Three problems, three parallelism patterns"
        description="Each task isolates a different reason GPUs are fast — or aren't."
        bordered
      >
        <div className={styles.taskGrid}>
          {tasks.map((task) => (
            <Link key={task.title} href={task.href} className={styles.taskCard}>
              <span className={styles.taskBadge}>{task.badge}</span>
              <span className={styles.taskPattern}>{task.pattern}</span>
              <h3 className={styles.taskTitle}>{task.title}</h3>
              <p className={styles.taskDesc}>{task.description}</p>
              <span className={styles.taskArrow}>→</span>
            </Link>
          ))}
        </div>
      </Section>

      <CpuSection />

      <Section eyebrow="Stack" title="Tools we used" bordered>
        <div className={styles.stackGrid}>
          {stack.map((item) => (
            <div key={item.name} className={styles.stackItem}>
              <span className={styles.stackName}>{item.name}</span>
              <span className={styles.stackDetail}>{item.detail}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Headline numbers"
        title="Key findings"
        description="The full breakdown is on the benchmarks page — these are the ones that surprised us."
        bordered
      >
        <div className={styles.statsGrid}>
          <Stat
            value="98×"
            label="Mandelbrot speedup"
            caption="Optimized GPU vs single-threaded CPU at 4096×4096"
            trend="up"
          />
          <Stat
            value="40×"
            label="Dot product speedup"
            caption="Optimized GPU vs single-threaded CPU at 1B elements"
            trend="up"
          />
          <Stat
            value="32×"
            label="Heat equation speedup"
            caption="Tiled GPU vs single-threaded CPU at 2048×2048, 1000 steps"
            trend="up"
          />
          <Stat
            value="7×"
            label="Naive → optimized GPU"
            caption="The reduction kernel gains the most from warp-level merging"
          />
        </div>
      </Section>
    </>
  );
}
