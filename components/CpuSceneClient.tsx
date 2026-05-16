'use client';

import dynamic from 'next/dynamic';
import styles from './CpuScene.module.scss';

const CpuScene = dynamic(() => import('./CpuScene').then((m) => m.CpuScene), {
  ssr: false,
  loading: () => (
    <div className={styles.wrapper}>
      <div className={styles.loading}>
        <span className={styles.loadingText}>Loading CPU model...</span>
        <span className={styles.loadingDots}>
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>
  ),
});

export function CpuSceneClient() {
  return <CpuScene />;
}
