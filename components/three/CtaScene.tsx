"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { fresnelVertex, fresnelFragment } from "@/components/three/IceShader";
import IceParticles from "@/components/three/IceParticles";

function IceCrystal() {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.12;
      groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.2;
      groupRef.current.position.y = Math.sin(t * 0.35) * 0.08;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 氷の結晶体（フレネル発光） */}
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={fresnelVertex}
          fragmentShader={fresnelFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* 内側の金の稜線 */}
      <mesh scale={0.6} rotation={[0.5, 0.8, 0]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color="#c6a15b"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
}

/**
 * 最終CTAの背景 3D。ファーストビューとは異なる、氷の結晶の抽象表現。
 */
export default function CtaScene({ tier }: { tier: "high" | "low" }) {
  return (
    <Canvas
      dpr={[1, tier === "high" ? 1.5 : 1]}
      camera={{ fov: 40, position: [0, 0, 3.2] }}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
      className="!absolute inset-0"
    >
      <IceCrystal />
      <IceParticles
        count={tier === "high" ? 60 : 20}
        color="#cfe4f2"
        size={1.2}
        opacity={0.4}
        spread={[6, 4, 3]}
      />
      <IceParticles
        count={tier === "high" ? 40 : 14}
        color="#d8b76a"
        size={1}
        opacity={0.5}
        spread={[5, 3.5, 2]}
        additive
      />
    </Canvas>
  );
}
