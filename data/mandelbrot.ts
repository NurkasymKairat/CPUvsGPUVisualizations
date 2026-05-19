

export interface BenchmarkPoint {
  size: number;
  cpuNaive?: number;
  cpuOmp?: number;
  cpuAvx2?: number;
  gpuNaive?: number;
  gpuOptimized?: number;
}

export const mandelbrotData: BenchmarkPoint[] = [
  { size: 256,  cpuNaive: 51.832,  cpuOmp: 8.5323,  cpuAvx2: 8.1674,  gpuNaive: 0.707, gpuOptimized: 0.090 },
  { size: 512,  cpuNaive: 188.743, cpuOmp: 34.1192, cpuAvx2: 28.2134, gpuNaive: 0.718, gpuOptimized: 0.088 },
  { size: 1024, cpuNaive: 743.159, cpuOmp: 111.224, cpuAvx2: 119.273, gpuNaive: 0.762, gpuOptimized: 0.159 },
  { size: 2048, cpuNaive: 3130.62, cpuOmp: 448.762, cpuAvx2: 385.012, gpuNaive: 0.645, gpuOptimized: 0.385 },
  { size: 4096, cpuNaive: 11756.6, cpuOmp: 1753.77, cpuAvx2: 1553.53 },
];

export const mandelbrotMeta = {
  pattern: 'Embarrassingly parallel',
  title: 'Mandelbrot set',
  description:
    'Per-pixel escape-time iteration. Every pixel is independent, with no shared state and no reduction — the textbook case where a GPU should crush a CPU.',
  unit: 'ms',
  xLabel: 'Image size (pixels per side, log)',
  keyInsight:
    'GPU naive flatlines around 0.6–0.7 ms — that floor is kernel launch overhead, not compute. The optimized kernel reaches 0.09 ms at smaller sizes (8× over naive) by reducing warp divergence. At 2048², the optimized GPU is ~1167× faster than OpenMP CPU.',
};

export const mandelbrotHeadline = {
  speedupVsNaive: Math.round(3130.62 / 0.385),    // ≈ 8131x vs single-thread @ 2048 (optimized)
  speedupVsOmp:   Math.round(448.762 / 0.385),    // ≈ 1166x vs OpenMP        @ 2048 (optimized)
  optimizationGain: +(0.762 / 0.159).toFixed(2),  // 4.79x   optimized vs naive @ 1024
  largestSize: 2048,
};