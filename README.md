# GPU vs CPU — Parallelism Comparison

A computer architecture project report. Compares CPU (single-thread + OpenMP) and GPU (naive CUDA + optimized CUDA) implementations across three parallelism patterns:

1. **Mandelbrot** — embarrassingly parallel
2. **Dot product** — reduction
3. **Heat equation (2D stencil)** — nearest-neighbor

Built as a static Next.js 14 site with App Router, TypeScript, SASS modules, and Recharts.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Production build

```bash
npm run build
npm run start
```

## Project structure

```
app/                  App Router pages
  layout.tsx          Root layout + Inter / JetBrains Mono fonts
  page.tsx            Home (hero + tasks + stack + key findings)
  benchmarks/         Three log-log Recharts plots
  crossover/          Where the GPU starts winning
  visualizations/     Canvas slots (animation logic plugged in separately)
  team/               Contributors + AI tools disclosure
components/           Navigation, BenchmarkChart, Stat, Section, CodeBlock
data/                 mandelbrot.ts, dotproduct.ts, heat.ts — mock timing data
styles/               _variables.scss, _mixins.scss, _reset.scss, globals.scss
```

`next.config.js` `prependData` injects `_variables` and `_mixins` into every SCSS module, so component styles can use `$accent`, `@include container`, etc. without importing.

## Replacing the mock data

The three files in `data/` export typed arrays of `BenchmarkPoint`. Drop in real measurements with the same shape and the charts update.

## Adding a canvas animation

`app/visualizations/page.tsx` exposes refs through `canvasRefs.current[i]`. Add a `useEffect` that grabs the ref and runs your render loop.
