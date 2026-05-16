'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { CpuMesh } from './CpuMesh';
import styles from './CpuScene.module.scss';

export function CpuScene() {
  const draggingRef = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.loading} ${loaded ? styles.loadingHidden : ''}`}
        aria-hidden={loaded}
      >
        <span className={styles.loadingText}>Loading CPU model...</span>
        <span className={styles.loadingDots}>
          <span />
          <span />
          <span />
        </span>
      </div>

      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        aria-label="Interactive 3D model of an Intel CPU"
        role="img"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />

        <ambientLight intensity={0.55} />
        <directionalLight
          position={[6, 8, 5]}
          intensity={1.8}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight
          position={[-4, 2, -6]}
          intensity={1.4}
          color="#d9802b"
        />
        <directionalLight position={[0, -4, 3]} intensity={0.4} color="#ffd29a" />

        <Suspense fallback={null}>
          <Environment preset="studio" />
          <CpuMesh
            draggingRef={draggingRef}
            reducedMotion={reducedMotion}
            onLoaded={() => setLoaded(true)}
          />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!reducedMotion}
          autoRotateSpeed={0.4}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(Math.PI * 2) / 3}
          onStart={() => {
            draggingRef.current = true;
          }}
          onEnd={() => {
            draggingRef.current = false;
          }}
        />
      </Canvas>
    </div>
  );
}
