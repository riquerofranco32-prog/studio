"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  RoundedBox,
  useTexture,
  useVideoTexture,
} from "@react-three/drei";
import { RoundedBoxGeometry } from "three-stdlib";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import type { Project } from "@/types";

// Notebooks 3D de la rueda de Trabajo. Una sola escena WebGL con una
// notebook por proyecto: base de aluminio con teclado de teclas reales,
// trackpad y bisagra; tapa con bisel, cámara y la captura (o el clip) del
// proyecto en la pantalla. El scroll mueve la rueda y abre la tapa de la que
// llega al centro; las de los costados quedan cerradas.

// Ojo: en RoundedBox el radio tiene que ser menor que la mitad del lado más
// chico; si no, la geometría se infla y tapa lo que está pegado (la tapa
// llegó a cubrir la pantalla).
// Medidas en unidades de escena (≈ decímetros de una notebook de 14").
const W = 3.1; // ancho
const D = 2.12; // profundidad de la base
const BASE_T = 0.07; // espesor de la base
const LID_T = 0.04; // espesor de la tapa
const SCREEN_W = W - 0.16;
const SCREEN_H = SCREEN_W * (10 / 16);
const CHIN = 0.11;
const TOP_BEZEL = 0.09;
const LID_H = CHIN + SCREEN_H + TOP_BEZEL;

const OPEN = -1.86; // ~107°: abierta y apenas reclinada
const CLOSED = -0.012; // apoyada sobre el teclado

const SMALL = 0.36;

// Distribución del teclado en unidades de tecla, fila por fila.
const ROWS: { keys: number[]; depth: number }[] = [
  { keys: Array(14).fill(1), depth: 0.55 },
  { keys: [...Array(13).fill(1), 1.5], depth: 1 },
  { keys: [1.5, ...Array(12).fill(1), 1], depth: 1 },
  { keys: [1.8, ...Array(11).fill(1), 1.7], depth: 1 },
  { keys: [2.3, ...Array(10).fill(1), 2.2], depth: 1 },
  { keys: [1, 1, 1.25, 1.25, 4.9, 1.25, 1, 1, 1], depth: 1 },
];
const KB_W = 2.6;
const KEY_PITCH = 0.176;
const KEY_GAP = 0.03;
const KEY_H = 0.022;

function useKeyMatrices() {
  return useMemo(() => {
    const out: THREE.Matrix4[] = [];
    let z = 0.2;
    for (const row of ROWS) {
      const units = row.keys.reduce((a, b) => a + b, 0);
      const unit = KB_W / units;
      const depth = KEY_PITCH * row.depth - KEY_GAP;
      let x = -KB_W / 2;
      for (const k of row.keys) {
        const w = unit * k - KEY_GAP;
        const m = new THREE.Matrix4().compose(
          new THREE.Vector3(x + (unit * k) / 2, BASE_T + KEY_H / 2, z + depth / 2),
          new THREE.Quaternion(),
          new THREE.Vector3(w, KEY_H, depth),
        );
        out.push(m);
        x += unit * k;
      }
      z += KEY_PITCH * row.depth;
    }
    return { matrices: out, bottom: z };
  }, []);
}

function Keyboard() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const { matrices } = useKeyMatrices();
  // Geometría unitaria con canto redondeado; cada instancia la escala a su
  // tecla. El bisel es lo que hace que la luz marque el relieve.
  const geom = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 3, 0.22), []);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
  }, [matrices]);
  return (
    <instancedMesh ref={ref} args={[geom, undefined, matrices.length]} castShadow>
      <meshStandardMaterial color="#141518" roughness={0.62} metalness={0.05} />
    </instancedMesh>
  );
}

function ScreenImage({ src }: { src: string }) {
  // Color y nitidez se ajustan en la carga, dentro del propio hook.
  const tex = useTexture(src, (t) => {
    const one = Array.isArray(t) ? t[0] : t;
    one.colorSpace = THREE.SRGBColorSpace;
    one.anisotropy = 8;
  });
  return <meshBasicMaterial map={tex} toneMapped={false} />;
}

function pickVideo(video: NonNullable<Project["video"]>) {
  // WebM donde el navegador lo reproduce; si no, MP4 (Safari).
  const v = document.createElement("video");
  return v.canPlayType('video/webm; codecs="vp9"') ? video.webm : video.mp4;
}

function ScreenVideo({ src }: { src: string }) {
  const tex = useVideoTexture(src, { muted: true, loop: true, start: true, crossOrigin: "anonymous" });
  return <meshBasicMaterial map={tex} toneMapped={false} />;
}

const aluminum = new THREE.MeshPhysicalMaterial({
  color: "#c3c6cc",
  metalness: 1,
  roughness: 0.26,
  clearcoat: 0.25,
  clearcoatRoughness: 0.4,
});
const darkMetal = new THREE.MeshStandardMaterial({ color: "#1b1c20", metalness: 0.6, roughness: 0.45 });
const glassBlack = new THREE.MeshPhysicalMaterial({
  color: "#050506",
  metalness: 0,
  roughness: 0.08,
  clearcoat: 1,
  clearcoatRoughness: 0.05,
});

function imageUrl(src: string) {
  // Mismo optimizador que next/image: la pantalla no necesita el JPG de 2160px.
  return `/_next/image?url=${encodeURIComponent(src)}&w=1200&q=75`;
}

function Laptop({
  project,
  index,
  pos,
  mobile,
  active,
  onPick,
}: {
  project: Project;
  index: number;
  pos: MotionValue<number>;
  mobile: boolean;
  active: boolean;
  onPick: (i: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const accent = project.brand?.accent ?? "#ff4d2e";
  const { bottom: kbBottom } = useKeyMatrices();

  useFrame(() => {
    const g = group.current;
    const l = lid.current;
    if (!g || !l) return;
    const v = index - pos.get();
    const a = Math.abs(v);
    const near = W / 2 + (W * SMALL) / 2 + (mobile ? 0.25 : 0.45);
    const far = W * SMALL + 0.3;
    const off = a <= 1 ? a * near : near + (a - 1) * far;
    const t = Math.min(a, 1);
    const e = t * t * (3 - 2 * t);
    const s = 1 - (1 - SMALL) * e;
    g.position.set(Math.sign(v) * off, 0, -e * 0.6);
    g.scale.setScalar(s);
    g.rotation.y = -Math.max(-0.55, Math.min(0.55, v * 0.32));
    g.visible = a < (mobile ? 1.7 : 3.4);
    l.rotation.x = OPEN + (CLOSED - OPEN) * e;
  });

  function onClick(ev: ThreeEvent<MouseEvent>) {
    ev.stopPropagation();
    onPick(index);
  }

  return (
    <group
      ref={group}
      onClick={onClick}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      {/* Base: el origen es la bisagra; la base se extiende hacia la cámara. */}
      <RoundedBox args={[W, BASE_T, D]} radius={0.03} smoothness={4} position={[0, BASE_T / 2, D / 2]} material={aluminum} castShadow receiveShadow />
      {/* Hueco del teclado, apenas más oscuro que el aluminio. */}
      <mesh position={[0, BASE_T + 0.0008, 0.2 + (kbBottom - 0.2) / 2]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[KB_W + 0.06, kbBottom - 0.2 + 0.04]} />
        <meshStandardMaterial color="#2a2c31" metalness={0.7} roughness={0.5} />
      </mesh>
      <Keyboard />
      {/* Trackpad de vidrio. */}
      <RoundedBox args={[1.25, 0.004, 0.78]} radius={0.0015} smoothness={2} position={[0, BASE_T + 0.001, kbBottom + 0.12 + 0.39]}>
        <meshPhysicalMaterial color="#5d6067" metalness={0.8} roughness={0.18} clearcoat={0.6} />
      </RoundedBox>
      {/* Hueco para abrir la tapa. */}
      <mesh position={[0, BASE_T * 0.55, D + 0.001]}>
        <boxGeometry args={[0.42, BASE_T * 0.5, 0.004]} />
        <meshStandardMaterial color="#111215" />
      </mesh>
      {/* Bisagra. */}
      <mesh position={[0, BASE_T + 0.012, 0.02]} rotation-z={Math.PI / 2} material={darkMetal}>
        <cylinderGeometry args={[0.026, 0.026, W * 0.78, 20]} />
      </mesh>

      {/* Tapa: cerrada queda acostada sobre la base; abrir es rotar en X. */}
      <group ref={lid} position={[0, BASE_T + 0.004, 0.012]}>
        <RoundedBox args={[W, LID_T, LID_H]} radius={LID_T * 0.4} smoothness={4} position={[0, LID_T / 2, LID_H / 2]} material={aluminum} castShadow />
        {/* Logo del dorso con la luz de la marca. */}
        <mesh position={[0, LID_T + 0.0015, LID_H / 2]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.13, 40]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        {/* Bisel de vidrio negro. */}
        <mesh position={[0, -0.0015, LID_H / 2]} rotation-x={Math.PI / 2} material={glassBlack}>
          <planeGeometry args={[W - 0.03, LID_H - 0.03]} />
        </mesh>
        {/* Cámara. */}
        <mesh position={[0, -0.003, LID_H - TOP_BEZEL / 2]} rotation-x={Math.PI / 2}>
          <circleGeometry args={[0.014, 20]} />
          <meshStandardMaterial color="#1c2b3d" roughness={0.1} />
        </mesh>
        {/* Pantalla. */}
        <mesh position={[0, -0.003, CHIN + SCREEN_H / 2]} rotation-x={Math.PI / 2}>
          <planeGeometry args={[SCREEN_W, SCREEN_H]} />
          {/* La captura hace de póster mientras carga el clip del activo. */}
          <Suspense fallback={<meshBasicMaterial color="#0b0b0c" />}>
            {active && project.video ? (
              <Suspense fallback={<ScreenImage src={imageUrl(project.image)} />}>
                <ScreenVideo src={pickVideo(project.video)} />
              </Suspense>
            ) : (
              <ScreenImage src={imageUrl(project.image)} />
            )}
          </Suspense>
        </mesh>
      </group>
    </group>
  );
}

function CameraRig({ mobile }: { mobile: boolean }) {
  // Encuadre: la notebook activa en la mitad de arriba, dejando lugar abajo
  // para el nombre y la frase del proyecto. Se recalcula por frame (es
  // barato) para seguir cualquier cambio de tamaño del canvas.
  useFrame(({ camera, size }) => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const dist = mobile ? 12.5 / Math.min(1, aspect * 1.9) : 9.0;
    const fov = mobile ? 34 : 30;
    if (cam.fov !== fov) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
    cam.position.set(0, dist * 0.34, dist);
    // Mirar por debajo de la notebook la sube en el cuadro.
    cam.lookAt(0, mobile ? 0.25 : 0.3, 0.9);
  });
  return null;
}

export default function LaptopScene({
  projects,
  pos,
  active,
  mobile,
  onPick,
}: {
  projects: Project[];
  pos: MotionValue<number>;
  active: number;
  mobile: boolean;
  onPick: (i: number) => void;
}) {
  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 30, near: 0.1, far: 60, position: [0, 3, 8] }}
      className="!absolute inset-0"
    >
      <CameraRig mobile={mobile} />
      <hemisphereLight args={["#ffffff", "#1a1a1a", 0.6]} />
      <directionalLight position={[2.5, 6, 4]} intensity={1.6} />
      <directionalLight position={[-4, 3, -2]} intensity={0.5} />
      {/* Estudio de luces sin HDR externo: los reflejos del aluminio y las
          teclas salen de estos paneles. */}
      <Environment resolution={256} frames={1} environmentIntensity={1.5}>
        <Lightformer form="rect" intensity={3} position={[0, 6, -3]} rotation-x={Math.PI / 2.2} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[8, 2.5, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[6, 2, 2]} rotation-y={-Math.PI / 2} scale={[8, 2.5, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[0, 1, 7]} scale={[10, 1.2, 1]} />
        {/* Cenital: es lo que refleja la base de aluminio vista desde arriba. */}
        <Lightformer form="rect" intensity={2.2} position={[0, 7, 5]} rotation-x={Math.PI / 2.6} scale={[16, 7, 1]} />
      </Environment>
      {projects.map((p, i) => (
        <Laptop key={p.slug} project={p} index={i} pos={pos} mobile={mobile} active={i === active} onPick={onPick} />
      ))}
      <ContactShadows position={[0, -0.001, 0.8]} scale={[26, 10]} far={3} blur={2.4} opacity={0.75} resolution={512} color="#000000" />
    </Canvas>
  );
}
