'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import type { BenchmarkPoint } from '@/data/mandelbrot';
import styles from './BenchmarkChart.module.scss';

interface BenchmarkChartProps {
  data: BenchmarkPoint[];
  unit: string;
  xLabel: string;
  highlightCrossover?: boolean;
}

const SERIES = [
  { key: 'cpuNaive', label: 'CPU naive', color: '#60a5fa' },
  { key: 'cpuOpenMP', label: 'CPU OpenMP', color: '#1d4ed8' },
  { key: 'gpuNaive', label: 'GPU naive', color: '#86efac' },
  { key: 'gpuOptimized', label: 'GPU optimized', color: '#00ff88' },
] as const;

function formatSize(n: number): string {
  if (n >= 1_000_000_000) return `${n / 1_000_000_000}B`;
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000) return `${n / 1_000}K`;
  return `${n}`;
}

function formatMs(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(2)}s`;
  if (n >= 1) return `${n.toFixed(1)}ms`;
  return `${(n * 1000).toFixed(0)}µs`;
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipLabel}>size = {formatSize(Number(label))}</div>
      <div className={styles.tooltipRows}>
        {payload.map((row) => {
          const series = SERIES.find((s) => s.key === row.dataKey);
          return (
            <div key={row.dataKey as string} className={styles.tooltipRow}>
              <span className={styles.swatch} style={{ background: series?.color }} />
              <span className={styles.tooltipName}>{series?.label}</span>
              <span className={styles.tooltipValue}>{formatMs(Number(row.value))}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BenchmarkChart({ data, unit, xLabel }: BenchmarkChartProps) {
  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 32 }}>
          <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="size"
            scale="log"
            domain={['auto', 'auto']}
            type="number"
            tickFormatter={formatSize}
            stroke="#52525b"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            label={{
              value: xLabel,
              position: 'insideBottom',
              offset: -16,
              fill: '#71717a',
              fontSize: 12,
            }}
          />
          <YAxis
            scale="log"
            domain={['auto', 'auto']}
            type="number"
            tickFormatter={(v) => formatMs(v)}
            stroke="#52525b"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            label={{
              value: `Time (${unit}, log)`,
              angle: -90,
              position: 'insideLeft',
              offset: 8,
              fill: '#71717a',
              fontSize: 12,
              style: { textAnchor: 'middle' },
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1 }} />
          <Legend
            verticalAlign="top"
            align="right"
            height={36}
            iconType="plainline"
            wrapperStyle={{ paddingBottom: 8 }}
          />
          {SERIES.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 0, fill: s.color }}
              activeDot={{ r: 5, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
