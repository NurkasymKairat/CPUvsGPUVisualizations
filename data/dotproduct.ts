

import type { BenchmarkPoint } from './mandelbrot';

export const dotProductData: BenchmarkPoint[] = [
  { size: 1_000_000,   cpuNaive: 1.0785,  cpuOmp: 1.4946,  cpuAvx2: 0.3659,  gpuNaive: 26.846, gpuOptimized: 0.059 },
  { size: 10_000_000,  cpuNaive: 10.148,  cpuOmp: 4.2559,  cpuAvx2: 3.3087,  gpuNaive: 27.976, gpuOptimized: 0.479 },
  { size: 100_000_000, cpuNaive: 101.276, cpuOmp: 29.4139, cpuAvx2: 35.5352, gpuNaive: 26.794, gpuOptimized: 3.886 },
];

export const dotProductMeta = {
  pattern: 'Reduction · memory-bound',
  title: 'Dot product',
  description:
    'Multiply two long vectors element-wise and sum the results. Trivially parallel arithmetic — but the naive GPU implementation is bottlenecked by atomicAdd contention and PCIe overhead.',
  unit: 'ms',
  xLabel: 'Vector length (elements, log)',
  keyInsight:
    'Naive GPU is barely faster than CPU — atomicAdd serializes thousands of writes, and PCIe memcpy dominates. The optimized kernel (warp shuffle reduction, no atomics) reaches 3.9 ms at 100M elements — 7× faster than naive GPU and 7.5× faster than OpenMP. The lesson: parallelism alone is not enough; the reduction pattern itself must be GPU-friendly.',
};

export const dotProductHeadline = {
  // Now the headline is the OPTIMIZED speedup
  speedupVsOmp:        +(29.4139 / 3.886).toFixed(1),    // ≈ 7.6x  vs OpenMP    (optimized)
  speedupVsAvx2:       +(35.5352 / 3.886).toFixed(1),    // ≈ 9.1x  vs AVX2      (optimized)
  optimizationGain:    Math.round(26.794 / 3.886),       // ≈ 7x    optimized vs naive
  naiveVsOmp:          +(29.4139 / 26.794).toFixed(2),   // ≈ 1.10x naive (the original "insight")
  largestSize: 100_000_000,
};

