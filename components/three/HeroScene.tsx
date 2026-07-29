"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  dragonVertex,
  dragonFragment,
  auraFragment,
  heroVertex,
} from "@/components/three/IceShader";
import IceParticles from "@/components/three/IceParticles";

/** マウス座標（-1..1）をモジュールスコープで共有 */
const pointer = { x: 0, y: 0 };

const DRAGON_ASPECT = 1218 / 1326; // hero-main.webp の縦横比

/** 画面サイズから龍の絵のサイズ・位置を決める（横長=右寄せ / 縦長=中央） */
function useDragonLayout() {
  const { viewport } = useThree();
  return useMemo(() => {
    const isLandscape = viewport.width > viewport.height * 1.05;
    const maxH = viewport.height * (isLandscape ? 0.96 : 0.72);
    const maxW = viewport.width * (isLandscape ? 0.56 : 0.96);
    const h = Math.min(maxH, maxW / DRAGON_ASPECT);
    const w = h * DRAGON_ASPECT;
    const x = isLandscape ? viewport.width * 0.5 - w * 0.5 - viewport.width * 0.03 : 0;
    const y = isLandscape ? 0 : viewport.height * 0.1;
    return { w, h, x, y };
  }, [viewport.width, viewport.height]);
}

/** 金泥の龍(絵画)を浮き彫り + 動的光沢で 3D 化したメインプレーン */
function DragonPlane({ tier }: { tier: "high" | "low" }) {
  const texture = useTexture(
    `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/hero-main.webp`
  );
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const layout = useDragonLayout();

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uReveal: { value: 0 },
      uRelief: { value: 0.16 },
      uTexel: { value: new THREE.Vector2(1 / 1218, 1 / 1326) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame(({ clock }) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value = clock.elapsedTime;
    const m = mat.uniforms.uMouse.value as THREE.Vector2;
    m.x += (pointer.x - m.x) * 0.04;
    m.y += (pointer.y - m.y) * 0.04;
    // 墨の中からゆっくり現れる
    if (mat.uniforms.uReveal.value < 1) {
      mat.uniforms.uReveal.value = Math.min(1, mat.uniforms.uReveal.value + 0.005);
    }
  });

  const seg = tier === "high" ? 200 : 110;

  return (
    <mesh position={[layout.x, layout.y, 0]} scale={[layout.w, layout.h, 1]}>
      <planeGeometry args={[1, 1, seg, Math.round(seg * 1.18)]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={dragonVertex}
        fragmentShader={dragonFragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

/** 龍の残光: 同じ絵を加算合成で重ね、絵具の発光(ハロー)を作る */
function DragonHalo() {
  const texture = useTexture(
    `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/hero-main.webp`
  );
  const layout = useDragonLayout();
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.opacity = 0.1 + 0.05 * Math.sin(clock.elapsedTime * 0.5);
    }
  });

  return (
    <mesh
      position={[layout.x, layout.y, -0.06]}
      scale={[layout.w * 1.045, layout.h * 1.045, 1]}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        ref={matRef}
        map={texture}
        transparent
        opacity={0.12}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/** 龍の背後の金のオーラ */
function AuraPlane() {
  const layout = useDragonLayout();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uReveal: { value: 0 } }),
    []
  );
  useFrame(({ clock }) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value = clock.elapsedTime;
    if (mat.uniforms.uReveal.value < 1) {
      mat.uniforms.uReveal.value = Math.min(1, mat.uniforms.uReveal.value + 0.004);
    }
  });
  return (
    <mesh
      position={[layout.x, layout.y, -0.5]}
      scale={[layout.w * 2.1, layout.h * 1.7, 1]}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={heroVertex}
        fragmentShader={auraFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/** カメラワーク: 冒頭のドリーイン + マウス視差 + スクロールで寄る */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const intro = useRef(0);

  useFrame(({ camera }, delta) => {
    if (group.current) {
      group.current.rotation.y +=
        (pointer.x * 0.05 - group.current.rotation.y) * 0.04;
      group.current.rotation.x +=
        (-pointer.y * 0.035 - group.current.rotation.x) * 0.04;
    }
    // 冒頭: 遠景からゆっくり寄る(シネマティック・ドリーイン)
    intro.current = Math.min(1, intro.current + delta * 0.22);
    const eased = 1 - Math.pow(1 - intro.current, 3);
    const scroll = Math.min(window.scrollY / window.innerHeight, 1);
    const targetZ = 3.6 - eased * 0.9 - scroll * 0.38;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    // スクロールで龍がわずかに仰向く
    if (group.current) {
      group.current.rotation.x += scroll * 0.06 * 0.04;
    }
  });
  return <group ref={group}>{children}</group>;
}

type Props = {
  tier: "high" | "low";
};

/**
 * ファーストビュー: 金泥で描かれた龍の絵画を 3D 空間に立ち上げる。
 * 筆致の起伏をレリーフとして浮き彫りにし、動的ライティング・
 * 光のスイープ・龍眼の脈動・金粉の煌めきで「絵が生きている」状態を作る。
 */
export default function HeroScene({ tier }: Props) {
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        pointer.x = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
        pointer.y = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1);
      }
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("deviceorientation", onOrientation, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, []);

  const goldCount = tier === "high" ? 150 : 50;
  const iceCount = tier === "high" ? 60 : 20;

  return (
    <Canvas
      dpr={[1, tier === "high" ? 1.75 : 1.25]}
      camera={{ fov: 42, position: [0, 0, 3.6], near: 0.1, far: 12 }}
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
          <AuraPlane />
          <DragonHalo />
          <DragonPlane tier={tier} />
          {/* 飛沫のような金粉(絵の飛沫と呼応) */}
          <IceParticles
            count={goldCount}
            color="#d8b76a"
            size={1.3}
            opacity={0.65}
            spread={[7, 4.5, 2.5]}
            additive
          />
          {/* 白銀の粒(角・雲の白と呼応) */}
          <IceParticles
            count={iceCount}
            color="#e8ecf2"
            size={1.1}
            opacity={0.35}
            spread={[6.5, 4, 2]}
          />
        </Rig>
      </Suspense>
    </Canvas>
  );
}
