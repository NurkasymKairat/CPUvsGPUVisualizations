'use client';

import { useLayoutEffect, useMemo, useRef, useEffect, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, Group, Vector3, type Mesh } from 'three';

interface Rtx5090MeshProps {
  draggingRef: MutableRefObject<boolean>;
  reducedMotion: boolean;
  onLoaded?: () => void;
  targetSize?: number;
}

export function Rtx5090Mesh({
  draggingRef,
  reducedMotion,
  onLoaded,
  targetSize = 3.2,
}: Rtx5090MeshProps) {
  const ref = useRef<Group>(null);
  const { scene } = useGLTF('/models/rtx5090.glb');

  const fit = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / maxDim;
    return {
      scale,
      offset: center.multiplyScalar(-scale),
    };
  }, [scene, targetSize]);

  useLayoutEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    onLoaded?.();
  }, [onLoaded]);

  useFrame((_, delta) => {
    const group = ref.current;
    if (!group) return;

    if (!reducedMotion && !draggingRef.current) {
      group.rotation.y += 0.3 * delta;
    }

    const baseY = fit.offset.y;
    if (!reducedMotion) {
      const t = performance.now() * 0.001;
      group.position.y = baseY + Math.sin(t) * 0.08;
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
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/rtx5090.glb');
