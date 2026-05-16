'use client';

import dynamic from 'next/dynamic';
import styles from './HeroScene.module.scss';

const HeroScene = dynamic(() => import('./HeroScene').then((m) => m.HeroScene), {
  ssr: false,
  loading: () => (
    <div className={styles.wrapper}>
      <div className={styles.loading}>
        <span className={styles.loadingText}>Loading GPU model...</span>
        <span className={styles.loadingDots}>
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>
  ),
});

export function HeroSceneClient() {
  return <HeroScene />;
}
