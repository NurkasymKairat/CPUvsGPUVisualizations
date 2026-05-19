// Mandelbrot benchmark data
// Source: aggregated.csv (median of 5 runs per configuration)
// Hardware: 8-core CPU, NVIDIA T4 (Turing sm_75, 2560 CUDA cores)
//
// Notes:
// - gpu_naive missing at size=4096 (was not benchmarked)
// - gpu_optimized only at size=1024: single-point demonstration of
//   shared-memory + warp divergence mitigation (3.83x speedup vs naive)

export interface BenchmarkPoint {
  size: number;
  cpuNaive?: number;
  cpuOmp?: number;
  cpuAvx2?: number;
  gpuNaive?: number;
  gpuOptimized?: number;
}

export const mandelbrotData: BenchmarkPoint[] = [
  { size: 256,  cpuNaive: 51.832,  cpuOmp: 8.5323,  cpuAvx2: 8.1674,  gpuNaive: 0.707 },
  { size: 512,  cpuNaive: 188.743, cpuOmp: 34.1192, cpuAvx2: 28.2134, gpuNaive: 0.718 },
  { size: 1024, cpuNaive: 743.159, cpuOmp: 111.224, cpuAvx2: 119.273, gpuNaive: 0.762, gpuOptimized: 0.199 },
  { size: 2048, cpuNaive: 3130.62, cpuOmp: 448.762, cpuAvx2: 385.012, gpuNaive: 0.645 },
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
    'GPU time flatlines around 0.6–0.7 ms regardless of image size — that floor is kernel launch overhead, not compute. CPU time grows quadratically with side length, so the gap widens from ~70× at 256² to nearly 5000× at 2048².',
};

export const mandelbrotHeadline = {
  speedupVsNaive: Math.round(3130.62 / 0.645),    // ≈ 4854x vs single-thread @ 2048
  speedupVsOmp:   Math.round(448.762 / 0.645),    // ≈ 696x  vs OpenMP        @ 2048
  optimizationGain: +(0.762 / 0.199).toFixed(2),  // 3.83x   optimized vs naive @ 1024
  largestSize: 2048,
};

// Pattern: embarrassingly parallel
// Why GPU dominates: every pixel independent, no shared state
// Why timing flatlines on GPU: kernel launch overhead floor (~0.5-0.7ms on T4)
// Optimization: warp divergence mitigation gives 3.83x at 1024
