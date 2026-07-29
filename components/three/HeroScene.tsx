"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  heroVertex,
  heroFragment,
  mistFragment,
} from "@/components/three/IceShader";
import IceParticles from "@/components/three/IceParticles";

/** マウス座標（-1..1）をモジュールスコープで共有 */
const pointer = { x: 0, y: 0 };

function HeroImagePlane() {
  const texture = useTexture(
    `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/hero-main.webp`
  );
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uUvScale: { value: new THREE.Vector2(1, 1) },
      uUvOffset: { value: new THREE.Vector2(0, 0) },
      uReveal: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // cover フィット計算（画像が人物・料理・器いずれでも破綻しない）
  useEffect(() => {
    const img = texture.image as { width: number; height: number } | undefined;
    if (!img) return;
    const planeAspect = viewport.width / viewport.height;
    const imgAspect = img.width / img.height;
    const scale = new THREE.Vector2(1, 1);
    if (imgAspect > planeAspect) {
      scale.set(planeAspect / imgAspect, 1);
    } else {
      scale.set(1, imgAspect / planeAspect);
    }
    uniforms.uUvScale.value.copy(scale);
    uniforms.uUvOffset.value.set((1 - scale.x) / 2, (1 - scale.y) / 2);
  }, [texture, viewport.width, viewport.height, uniforms]);

  useFrame(({ clock }) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value = clock.elapsedTime;
    // マウスをゆっくり追従（急な動きを殺して上品に）
    const m = mat.uniforms.uMouse.value as THREE.Vector2;
    m.x += (pointer.x - m.x) * 0.03;
    m.y += (pointer.y - m.y) * 0.03;
    // スクロール量
    const p = Math.min(window.scrollY / window.innerHeight, 1);
    mat.uniforms.uScroll.value += (p - mat.uniforms.uScroll.value) * 0.08;
    // 霧の中から現れる（マウント後ゆっくり 0→1）
    if (mat.uniforms.uReveal.value < 1) {
      mat.uniforms.uReveal.value = Math.min(
        1,
        mat.uniforms.uReveal.value + 0.006
      );
    }
  });

  return (
    <mesh scale={[viewport.width * 1.12, viewport.height * 1.12, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={heroVertex}
        fragmentShader={heroFragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

/** 手前を流れる墨と霧のレイヤー */
function MistPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uOpacity: { value: 0.55 } }),
    []
  );
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });
  return (
    <mesh position={[0, 0, 0.5]} scale={[viewport.width * 1.2, viewport.height * 1.2, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={heroVertex}
        fragmentShader={mistFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

/** カメラ・グループの動き（視差 + スクロールで寄る） */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ camera }) => {
    if (group.current) {
      group.current.rotation.y +=
        (pointer.x * 0.035 - group.current.rotation.y) * 0.04;
      group.current.rotation.x +=
        (-pointer.y * 0.025 - group.current.rotation.x) * 0.04;
    }
    const p = Math.min(window.scrollY / window.innerHeight, 1);
    const targetZ = 2.4 - p * 0.35;
    camera.position.z += (targetZ - camera.position.z) * 0.06;
  });
  return <group ref={group}>{children}</group>;
}

type Props = {
  tier: "high" | "low";
};

/**
 * ファーストビューの 3D シーン。
 * 指定画像をテクスチャとして 3D プレーンに適用し、カスタムシェーダーで
 * 微細なディストーション・屈折・光沢を加える。氷片と金の粒子が漂う。
 */
export default function HeroScene({ tier }: Props) {
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    // 端末の傾きにも対応（モバイル）
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        pointer.x = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
        pointer.y = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1);
      }
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("deviceorientation", onOrientation, {
      passive: true,
    });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, []);

  const iceCount = tier === "high" ? 110 : 36;
  const goldCount = tier === "high" ? 70 : 24;

  return (
    <Canvas
      dpr={[1, tier === "high" ? 1.75 : 1.25]}
      camera={{ fov: 42, position: [0, 0, 2.4], near: 0.1, far: 10 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      aria-hidden="true"
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <Rig>
          <HeroImagePlane />
          {/* 氷片：青白くゆっくり浮遊 */}
          <IceParticles
            count={iceCount}
            color="#cfe4f2"
            size={1.4}
            opacity={0.45}
            spread={[7, 4.5, 2.5]}
          />
          {/* 金箔：加算合成でかすかに煌めく */}
          <IceParticles
            count={goldCount}
            color="#d8b76a"
            size={1.1}
            opacity={0.6}
            spread={[6, 4, 2]}
            additive
          />
          <MistPlane />
        </Rig>
      </Suspense>
    </Canvas>
  );
}
