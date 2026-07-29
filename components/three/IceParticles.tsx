"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { particleVertex, particleFragment } from "@/components/three/IceShader";

type Props = {
  count?: number;
  color?: string;
  size?: number;
  opacity?: number;
  spread?: [number, number, number];
  additive?: boolean;
};

/**
 * 浮遊する粒子（氷片・金箔）。
 * カスタムシェーダーで各粒子がゆっくり漂い、静かに明滅する。
 */
export default function IceParticles({
  count = 80,
  color = "#cfe4f2",
  size = 1.6,
  opacity = 0.5,
  spread = [6, 4, 2],
  additive = false,
}: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, scales, randoms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const randoms = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread[0];
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread[2];
      scales[i] = 0.4 + Math.random() * 1.2;
      randoms[i * 3] = 0.5 + Math.random();
      randoms[i * 3 + 1] = Math.random();
      randoms[i * 3 + 2] = Math.random();
    }
    return { positions, scales, randoms };
    // spread は固定値として扱う
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: size * 10 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}
