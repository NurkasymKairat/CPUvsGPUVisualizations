import type { BenchmarkPoint } from './mandelbrot';

export const dotProductData: BenchmarkPoint[] = [
  { size: 1_000_000, cpuNaive: 4.2, cpuOpenMP: 1.1, gpuNaive: 2.8, gpuOptimized: 0.42 },
  { size: 10_000_000, cpuNaive: 42, cpuOpenMP: 8.5, gpuNaive: 6.1, gpuOptimized: 1.8 },
  { size: 100_000_000, cpuNaive: 425, cpuOpenMP: 78, gpuNaive: 34, gpuOptimized: 12 },
  { size: 1_000_000_000, cpuNaive: 4280, cpuOpenMP: 790, gpuNaive: 310, gpuOptimized: 105 },
];

export const dotProductMeta = {
  title: 'Dot Product',
  pattern: 'Reduction',
  description:
    'A pairwise multiply followed by a global sum. The reduction step needs a tree-style merge — a textbook case where naive GPU code loses to optimized GPU code.',
  keyInsight:
    'The naive GPU kernel uses atomic adds and barely beats OpenMP. The optimized version (warp shuffles + shared-memory tree reduction) is ~7× faster than the naive GPU and ~40× faster than the single-threaded CPU at 1B elements.',
  unit: 'ms',
  xLabel: 'Vector size (elements)',
};
