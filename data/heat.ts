

import type { BenchmarkPoint } from './mandelbrot';

export const heatData: BenchmarkPoint[] = [
  { size: 128,  cpuNaive: 15.5224, cpuOmp: 36.4151, cpuAvx2: 3.3753 },
  { size: 256,  cpuNaive: 63.2442, cpuOmp: 66.7044, cpuAvx2: 20.2513, gpuNaive: 2.99 },
  { size: 512,  cpuNaive: 504.082, cpuOmp: 200.357, cpuAvx2: 203.656, gpuNaive: 2.927 },
  { size: 1024, cpuNaive: 1521.78, cpuOmp: 526.038, cpuAvx2: 515.654, gpuNaive: 2.9 },
];

export const heatMeta = {
  pattern: 'Stencil · iterative',
  title: 'Heat equation (2D Jacobi)',
  description:
    'Each cell averages its four neighbors, repeated over many time steps. High arithmetic intensity per byte moved — the kind of structured workload GPUs are designed for.',
  unit: 'ms',
  xLabel: 'Grid size (N×N, log)',
  keyInsight:
    'OpenMP is actually slower than naive at N=128 — thread spin-up costs exceed the work. The GPU sits near a ~3 ms launch floor across all sizes; at N=1024 it is ~180× faster than OpenMP and ~525× faster than single-thread. Our shared-memory tiling attempts regressed vs naive — discussed honestly on the methodology page.',
};

export const heatHeadline = {
  speedupVsOmp:   Math.round(526.038 / 2.9),    // ≈ 181x  vs OpenMP        @ 1024
  speedupVsNaive: Math.round(1521.78 / 2.9),    // ≈ 525x  vs single-thread @ 1024
  largestSize: 1024,
};