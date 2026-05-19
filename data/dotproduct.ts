// Dot product benchmark data
// Source: aggregated.csv (median of 5 runs per configuration)
// Hardware: 8-core CPU, NVIDIA T4
//
// KEY INSIGHT (the main story of this task):
// GPU is barely faster than CPU here. Dot product is MEMORY-BOUND.
// 100M floats = 400MB. PCIe Gen3 x16 ~ 12-16 GB/s → 25-30ms for transfer alone.
// Kernel time is microseconds; total is dominated by host↔device memcpy.
// Main lesson: GPU is NOT magically faster for every workload.
//
// gpu_optimized: omitted — our optimized measurement was at size=1024 elements
// (a micro-task), incomparable to the 1M-100M sizes used elsewhere.

import type { BenchmarkPoint } from './mandelbrot';

export const dotProductData: BenchmarkPoint[] = [
  { size: 1_000_000,   cpuNaive: 1.0785,  cpuOmp: 1.4946,  cpuAvx2: 0.3659,  gpuNaive: 26.846 },
  { size: 10_000_000,  cpuNaive: 10.148,  cpuOmp: 4.2559,  cpuAvx2: 3.3087,  gpuNaive: 27.976 },
  { size: 100_000_000, cpuNaive: 101.276, cpuOmp: 29.4139, cpuAvx2: 35.5352, gpuNaive: 26.794 },
];

export const dotProductMeta = {
  pattern: 'Reduction · memory-bound',
  title: 'Dot product',
  description:
    'Multiply two long vectors element-wise and sum the results. Trivially parallel arithmetic, but the bottleneck is moving 400 MB of floats across PCIe — not the math.',
  unit: 'ms',
  xLabel: 'Vector length (elements, log)',
  keyInsight:
    'The GPU is barely faster than AVX2 here, and slower than CPU at 1M elements. Host↔device transfer dominates total time; the kernel itself is microseconds. Lesson: GPUs are not magic — memory-bound workloads see little speedup when transfer is included.',
};

export const dotProductHeadline = {
  speedupVsOmp:  +(29.4139 / 26.794).toFixed(2),   // ≈ 1.10x
  speedupVsAvx2: +(35.5352 / 26.794).toFixed(2),   // ≈ 1.33x
  largestSize: 100_000_000,
  insight: 'memory-bound',
};

// Pattern: reduction (parallel sum)
// Why GPU underperforms: memcpy H2D + D2H dominates; atomic-based reduction
// What would help: pinned memory, async transfer, kernel-only timing
