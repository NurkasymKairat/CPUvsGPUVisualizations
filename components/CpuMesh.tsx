'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, Group, Vector3, type Mesh } from 'three';

interface CpuMeshProps {
  draggingRef: MutableRefObject<boolean>;
  reducedMotion: boolean;
  onLoaded?: () => void;
  targetSize?: number;
}

export function CpuMesh({
  draggingRef,
  reducedMotion,
  onLoaded,
  targetSize = 2.5,
}: CpuMeshProps) {
  const ref = useRef<Group>(null);
  const { scene } = useGLTF('/models/free_intel_cpu.glb');


  const instance = useMemo(() => scene.clone(true), [scene]);

  const fit = useMemo(() => {
    const box = new Box3().setFromObject(instance);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / maxDim;
    return {
      scale,
      offset: center.multiplyScalar(-scale),
    };
  }, [instance, targetSize]);

  useLayoutEffect(() => {
    instance.traverse((obj) => {
      const mesh = obj as Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [instance]);

  useEffect(() => {
    onLoaded?.();
  }, [onLoaded]);

  useFrame((_, delta) => {
    const group = ref.current;
    if (!group) return;

    if (!reducedMotion && !draggingRef.current) {
      group.rotation.y += 0.25 * delta;
    }

    const baseY = fit.offset.y;
    if (!reducedMotion) {
      const t = performance.now() * 0.001;
      group.position.y = baseY + Math.sin(t) * 0.07;
    } else {
      group.position.y = baseY;
    }
  });

  return (
    <group
      ref={ref}
      scale={fit.scale}
      position={[fit.offset.x, fit.offset.y, fit.offset.z]}
    >
      <primitive object={instance} />
    </group>
  );
}

useGLTF.preload('/models/free_intel_cpu.glb');
