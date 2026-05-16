'use client';

import { useRef } from 'react';
import styles from './page.module.scss';

const slots = [
  {
    id: 'threads',
    title: 'Thread execution model',
    subtitle: 'CPU lanes vs GPU warps',
    description:
      'Animate how 8 CPU threads chew through a workload sequentially compared to thousands of GPU threads running in lock-step warps.',
  },
  {
    id: 'memory',
    title: 'Memory hierarchy traversal',
    subtitle: 'Cache vs shared memory',
    description:
      'Visualize a stencil access pattern: every cell touches its neighbors. Show why a tiled kernel that loads neighbors into shared memory once beats one that re-reads them from global memory.',
  },
  {
    id: 'reduction',
    title: 'Tree-style reduction',
    subtitle: 'Warp shuffles in action',
    description:
      'Animate a 32-element warp folding pairs of partial sums together — log2(32) = 5 steps to reduce a warp without touching shared memory.',
  },
];

export default function VisualizationsPage() {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  return (
    <>
      <section className={styles.intro}>
        <div className={styles.introInner}>
          <span className={styles.eyebrow}>Visualizations</span>
          <h1 className={styles.title}>Why GPU parallelism feels different</h1>
          <p className={styles.description}>
            Numbers tell you <em>how much</em> faster the GPU is. These animations show{' '}
            <em>why</em>. Each canvas below illustrates one piece of the architectural story —
            execution model, memory hierarchy, and reduction strategy.
          </p>
          <p className={styles.placeholder}>
            <span className={styles.placeholderTag}>WIP</span>
            Canvas animation logic is being written separately. The DOM slots are wired up
            below — drop your render loop into the matching <code>canvasRefs.current[i]</code>{' '}
            inside a <code>useEffect</code>.
          </p>
        </div>
      </section>

      {slots.map((slot, idx) => (
        <section
          key={slot.id}
          id={slot.id}
          className={`${styles.viz} ${idx > 0 ? styles.bordered : ''}`}
        >
          <div className={styles.vizInner}>
            <header className={styles.vizHeader}>
              <span className={styles.vizIndex}>{`0${idx + 1}`.padStart(2, '0')}</span>
              <div>
                <span className={styles.vizSubtitle}>{slot.subtitle}</span>
                <h2 className={styles.vizTitle}>{slot.title}</h2>
                <p className={styles.vizDesc}>{slot.description}</p>
              </div>
            </header>

            <div className={styles.canvasWrapper}>
              <canvas
                ref={(el) => {
                  canvasRefs.current[idx] = el;
                }}
                width={800}
                height={400}
                className={styles.canvas}
                aria-label={slot.title}
              />
              <div className={styles.canvasOverlay}>
                <span>800 × 400 canvas — animation hook ready</span>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
