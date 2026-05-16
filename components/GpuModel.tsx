'use client';

import { HeroSceneClient } from './HeroSceneClient';
import styles from './ModelSlot.module.scss';

interface GpuModelProps {
  className?: string;
}

export function GpuModel({ className }: GpuModelProps) {
  return (
    <div
      className={`${styles.slot} ${styles.gpu} ${className ?? ''}`}
      aria-label="GPU 3D model slot"
    >
      <div className={styles.hostedScene}>
        <HeroSceneClient />
      </div>
    </div>
  );
}
