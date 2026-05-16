'use client';

import { CpuSceneClient } from './CpuSceneClient';
import styles from './ModelSlot.module.scss';

interface CpuModelProps {
  className?: string;
}

export function CpuModel({ className }: CpuModelProps) {
  return (
    <div
      className={`${styles.slot} ${styles.cpu} ${className ?? ''}`}
      aria-label="CPU 3D model slot"
    >
      <div className={styles.hostedScene}>
        <CpuSceneClient />
      </div>
    </div>
  );
}
