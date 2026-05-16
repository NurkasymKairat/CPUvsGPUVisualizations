export interface BenchmarkPoint {
  size: number;
  cpuNaive: number;
  cpuOpenMP: number;
  gpuNaive: number;
  gpuOptimized: number;
}

export const mandelbrotData: BenchmarkPoint[] = [
  { size: 512, cpuNaive: 245, cpuOpenMP: 38, gpuNaive: 12, gpuOptimized: 8 },
  { size: 1024, cpuNaive: 980, cpuOpenMP: 152, gpuNaive: 28, gpuOptimized: 15 },
  { size: 2048, cpuNaive: 3920, cpuOpenMP: 612, gpuNaive: 95, gpuOptimized: 42 },
  { size: 4096, cpuNaive: 15680, cpuOpenMP: 2448, gpuNaive: 380, gpuOptimized: 160 },
];

export const mandelbrotMeta = {
  title: 'Mandelbrot Set',
  pattern: 'Embarrassingly parallel',
  description:
    'Every pixel is independent — no shared state, no synchronization. The canonical case where the GPU should crush the CPU.',
  keyInsight:
    'At 4096×4096 the optimized GPU kernel is ~98× faster than the single-threaded CPU and ~15× faster than the 8-core OpenMP build. The gap widens with image size because the GPU stays under-utilized at small inputs.',
  unit: 'ms',
  xLabel: 'Image size (N×N)',
};
