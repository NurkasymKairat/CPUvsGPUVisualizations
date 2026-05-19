'use client';

import { useState } from 'react';
import { mandelbrotData, mandelbrotMeta } from '@/data/mandelbrot';
import { dotProductData, dotProductMeta } from '@/data/dotproduct';
import { heatData, heatMeta } from '@/data/heat';
import type { BenchmarkPoint } from '@/data/mandelbrot';
import { SpeedRace } from '@/components/SpeedRace';
import styles from './page.module.scss';

interface Workload {
  id: string;
  data: BenchmarkPoint[];
  meta: { pattern: string; title: string };
  sizeSuffix: string;
  formatSize: (n: number) => string;
  notes: string[];
}

const formatPixels = (n: number) => `${n}`;
const formatElements = (n: number) => {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000) return `${n / 1_000}K`;
  return `${n}`;
};

const workloads: Workload[] = [
  {
    id: 'mandelbrot',
    data: mandelbrotData,
    meta: mandelbrotMeta,
    sizeSuffix: '²',
    formatSize: formatPixels,
    notes: [
      'At 256², the image is so small that the kernel-launch floor (~0.6 ms) is most of the GPU time. The optimized GPU still wins, but the absolute gap is tiny — speedup ratios look dramatic only because the work itself is small.',
      'At 512², GPU times stay almost flat on the launch-overhead floor while CPU times have grown roughly 4×. The vertical gap between CPU and GPU starts opening for real.',
      'At 1024², reducing warp divergence gives the optimized GPU a ~4.8× lead over the naive GPU. Optimized GPU is roughly 700× faster than OpenMP on the same image.',
      'At 2048², compute is finally large enough that GPU times begin to grow too. Even so, the optimized kernel stays ~1167× faster than OpenMP.',
      'At 4096², GPU runs were not measured. Among CPU implementations, AVX2 (vectorized inner loop) holds its own against OpenMP (thread-level parallelism) — two different ways to cut per-pixel cost.',
    ],
  },
  {
    id: 'dotproduct',
    data: dotProductData,
    meta: dotProductMeta,
    sizeSuffix: '',
    formatSize: formatElements,
    notes: [
      'At 1M elements, the naive GPU (~27 ms) is far slower than every CPU implementation — host↔device PCIe transfer dominates the total. AVX2 wins outright if you already have the data on the host.',
      'At 10M elements, naive GPU is still anchored to its transfer floor. The optimized GPU pulls ahead of CPU, but the gap is modest at this size.',
      'At 100M elements, the math finally amortizes PCIe transfer. Optimized GPU is ~7× faster than naive GPU and ~9× faster than AVX2 — the lesson is the naive→optimized jump: a warp-shuffle reduction beats atomicAdd contention.',
    ],
  },
  {
    id: 'heat',
    data: heatData,
    meta: heatMeta,
    sizeSuffix: '²',
    formatSize: formatPixels,
    notes: [
      'At N=128, the grid is so small that OpenMP is actually slower than the single-threaded naive kernel — thread spin-up costs exceed the work. AVX2 vectorization wins here. GPU was not measured at this size.',
      'At N=256, the GPU appears and is ~7× faster than AVX2. Our shared-memory tiling attempt is slightly slower than the naive GPU kernel — a negative result discussed honestly on the methodology page rather than hidden.',
      'At N=512, naive GPU pulls firmly ahead. The tiling regression persists; we report it rather than burying it.',
      'At N=1024, naive GPU is the clear winner — about 13× faster than OpenMP. The tiled kernel is still slower than naive due to halo loading inefficiencies.',
    ],
  },
];

export default function VisualizationsPage() {
  return (
    <>
      <section className={styles.intro}>
        <div className={styles.introInner}>
          <span className={styles.eyebrow}>Visualizations</span>
          <h1 className={styles.title}>Pick a size, see who wins</h1>
          <p className={styles.description}>
            Drag the slider on each workload to pick a problem size. The implementations
            animate to their relative wall-clock times — <em>longer bar = slower</em>. The
            fastest implementation glows green; the slowest dims red.
          </p>
        </div>
      </section>

      {workloads.map((w, idx) => (
        <WorkloadSection key={w.id} workload={w} bordered={idx > 0} />
      ))}
    </>
  );
}

interface SectionProps {
  workload: Workload;
  bordered: boolean;
}

function WorkloadSection({ workload, bordered }: SectionProps) {
  const [sizeIdx, setSizeIdx] = useState(workload.data.length - 1);
  const point = workload.data[sizeIdx];
  const note = workload.notes[sizeIdx];
  const sizeLabel = `${workload.formatSize(point.size)}${workload.sizeSuffix}`;

  return (
    <section
      id={workload.id}
      className={`${styles.workload} ${bordered ? styles.bordered : ''}`}
    >
      <div className={styles.workloadInner}>
        <header className={styles.workloadHeader}>
          <span className={styles.pattern}>{workload.meta.pattern}</span>
          <h2 className={styles.workloadTitle}>{workload.meta.title}</h2>
        </header>

        <div className={styles.sliderBlock}>
          <div className={styles.sliderHead}>
            <span className={styles.sliderLabel}>Problem size</span>
            <span className={styles.sliderValue}>{sizeLabel}</span>
          </div>
          <div className={styles.ticks}>
            {workload.data.map((p, i) => (
              <button
                key={p.size}
                type="button"
                className={`${styles.tick} ${i === sizeIdx ? styles.tickActive : ''}`}
                onClick={() => setSizeIdx(i)}
                aria-pressed={i === sizeIdx}
              >
                {workload.formatSize(p.size)}
                {workload.sizeSuffix}
              </button>
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={workload.data.length - 1}
            step={1}
            value={sizeIdx}
            onChange={(e) => setSizeIdx(Number(e.target.value))}
            className={styles.slider}
            aria-label={`Problem size for ${workload.meta.title}`}
          />
        </div>

        <SpeedRace data={point} title={`size = ${sizeLabel}`} />

        <p className={styles.note}>{note}</p>
      </div>
    </section>
  );
}
