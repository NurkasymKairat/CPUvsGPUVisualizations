import type { BenchmarkPoint } from './mandelbrot';

export const heatData: BenchmarkPoint[] = [
  { size: 256, cpuNaive: 180, cpuOpenMP: 32, gpuNaive: 24, gpuOptimized: 9 },
  { size: 512, cpuNaive: 720, cpuOpenMP: 128, gpuNaive: 78, gpuOptimized: 28 },
  { size: 1024, cpuNaive: 2880, cpuOpenMP: 512, gpuNaive: 290, gpuOptimized: 96 },
  { size: 2048, cpuNaive: 11520, cpuOpenMP: 2048, gpuNaive: 1140, gpuOptimized: 360 },
];

export const heatMeta = {
  title: 'Heat Equation (2D Stencil)',
  pattern: 'Stencil / nearest-neighbor',
  description:
    'Each cell reads its four neighbors per iteration. Memory access dominates — tiling into shared memory is the key optimization.',
  keyInsight:
    'Naive GPU is memory-bound (each cell is read 5× from global memory). Shared-memory tiling reuses neighbors and gives a ~3× speedup over the naive kernel and ~32× over the single-threaded CPU at 2048×2048.',
  unit: 'ms',
  xLabel: 'Grid size (N×N), 1000 iterations',
};
