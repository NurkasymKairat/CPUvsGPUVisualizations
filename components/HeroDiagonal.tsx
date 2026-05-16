'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { CpuModel } from './CpuModel';
import { GpuModel } from './GpuModel';
import styles from './HeroDiagonal.module.scss';

const EASE = [0.2, 0.8, 0.2, 1] as const;

interface CalloutData {
  k: string;
  v: string;
  side: 'left' | 'right';
  stackIndex: 0 | 1;
  tone: 'cpu' | 'gpu';
}

const callouts: CalloutData[] = [
  { k: 'cores', v: '8 P · 16 T', side: 'left', stackIndex: 1, tone: 'cpu' },
  { k: 'L3', v: '36 MB', side: 'left', stackIndex: 0, tone: 'cpu' },
  { k: 'SMs', v: '170', side: 'right', stackIndex: 1, tone: 'gpu' },
  { k: 'VRAM', v: '32 GB', side: 'right', stackIndex: 0, tone: 'gpu' },
];

export function HeroDiagonal() {
  const reduceMotion = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initial = reduceMotion ? 'visible' : 'hidden';
  const animate = reduceMotion ? 'visible' : mounted ? 'visible' : 'hidden';

  const cpuModelVariants: Variants = {
    hidden: { x: -240, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: EASE },
    },
  };

  const gpuModelVariants: Variants = {
    hidden: { x: 240, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: EASE },
    },
  };

  const seamVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut', delay: 0.7 },
    },
  };

  const headlineGroupVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 1.0,
        staggerChildren: 0.08,
      },
    },
  };

  const headlineItemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  };

  const calloutVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease: 'easeOut', delay: 1.45 + i * 0.08 },
    }),
  };

  const connectorVariants: Variants = {
    hidden: { pathLength: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      transition: { duration: 0.32, ease: EASE, delay: 1.5 + i * 0.08 },
    }),
  };

  return (
    <section className={styles.hero}>
      {/* Diagonal seam */}
      <motion.div
        className={styles.seam}
        variants={seamVariants}
        initial={initial}
        animate={animate}
      >
        <svg
          className={styles.seamSvg}
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="seam-gradient" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#d9802b" stopOpacity="0" />
              <stop offset="15%" stopColor="#d9802b" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#ffe9a8" stopOpacity="1" />
              <stop offset="85%" stopColor="#2bb56a" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#2bb56a" stopOpacity="0" />
            </linearGradient>
            <filter id="seam-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>
          <line
            x1="-60"
            y1="660"
            x2="1260"
            y2="-60"
            stroke="url(#seam-gradient)"
            strokeWidth="5"
            filter="url(#seam-glow)"
          />
          <line
            x1="-60"
            y1="660"
            x2="1260"
            y2="-60"
            stroke="#fff5cf"
            strokeWidth="1"
            opacity="0.85"
          />
        </svg>
      </motion.div>

      {/* 3D model halves */}
      <motion.div
        className={`${styles.modelHalf} ${styles.cpuHalf}`}
        variants={cpuModelVariants}
        initial={initial}
        animate={animate}
      >
        <CpuModel />
      </motion.div>

      <motion.div
        className={`${styles.modelHalf} ${styles.gpuHalf}`}
        variants={gpuModelVariants}
        initial={initial}
        animate={animate}
      >
        <GpuModel />
      </motion.div>

      {/* Centered headline straddling the seam */}
      <motion.div
        className={styles.headlineGroup}
        variants={headlineGroupVariants}
        initial={initial}
        animate={animate}
      >
        <motion.span className={styles.eyebrow} variants={headlineItemVariants}>
          Computer architecture · final project
        </motion.span>
        <motion.h1 className={styles.headline} variants={headlineItemVariants}>
          <span className={styles.cpuWord}>CPU</span>
          <span className={styles.vsWord}>vs</span>
          <span className={styles.gpuWord}>GPU</span>
        </motion.h1>
        <motion.p className={styles.subhead} variants={headlineItemVariants}>
          Two architectures, three workloads, one wall-clock.
        </motion.p>
        <motion.div className={styles.ctas} variants={headlineItemVariants}>
          <Link href="/benchmarks" className={styles.primaryCta}>
            View benchmarks →
          </Link>
          <Link href="/crossover" className={styles.ghostCta}>
            See crossover points
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating stat callouts */}
      {callouts.map((c, i) => (
        <motion.div
          key={`${c.side}-${c.stackIndex}`}
          className={`${styles.callout} ${styles[c.tone]} ${styles[c.side]} ${
            styles[`stack${c.stackIndex}`]
          }`}
          variants={calloutVariants}
          custom={i}
          initial={initial}
          animate={animate}
        >
          <span className={styles.calloutKey}>{c.k}</span>
          <span className={styles.calloutValue}>{c.v}</span>
          <svg className={styles.calloutConnector} viewBox="0 0 30 1" aria-hidden="true">
            <motion.line
              x1="0"
              y1="0.5"
              x2="30"
              y2="0.5"
              stroke="currentColor"
              strokeWidth="1"
              variants={connectorVariants}
              custom={i}
              initial={initial}
              animate={animate}
            />
          </svg>
        </motion.div>
      ))}
    </section>
  );
}
