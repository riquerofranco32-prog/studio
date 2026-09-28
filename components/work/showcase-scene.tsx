"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  RoundedBox,
  useTexture,
  useVideoTexture,
} from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import type { Project } from "@/types";

// Vidriera 3D de la rueda de Trabajo. Cada proyecto es una pantalla de vidrio
// con canto de aluminio, parada sobre agua negra y quieta que la refleja de
// verdad (MeshReflectorMaterial con un mapa de ondas). El scroll gira la rueda: la pantalla que
// llega al centro se adelanta y se enciende con su sitio; las de los
// costados quedan atenuadas, giradas en arco.

// Pantalla 16:10 en unidades de escena. Ojo con RoundedBox: el radio tiene
// que ser menor que la mitad del lado más chico, si no la geometría se infla.
const SW = 3.2;
const SH = SW * (10 / 16);
const FRAME = 0.07; // marco negro alrededor de la imagen
const DEPTH = 0.07; // espesor del panel
const LIFT = 0.1; // separación del piso (pie invisible)

const SMALL = 0.46;

function imageUrl(src: string) {
  // Mismo optimizador que next/image: la pantalla no necesita el JPG de 2160px.
  return `/_next/image?url=${encodeURIComponent(src)}&w=1200&q=75`;
}

function pickVideo(video: NonNullable<Project["video"]>) {
  // WebM donde el navegador lo reproduce; si no, MP4 (Safari).
  const v = document.createElement("video");
  return v.canPlayType('video/webm; codecs="vp9"') ? video.webm : video.mp4;
}

type Lit = { current: THREE.MeshBasicMaterial | null };

function ScreenImage({ src, mat }: { src: string; mat: Lit }) {
  // Color y nitidez se ajustan en la carga, dentro del propio hook.
  const tex = useTexture(src, (t) => {
    const one = Array.isArray(t) ? t[0] : t;
    one.colorSpace = THREE.SRGBColorSpace;
    one.anisotropy = 8;
  });
  return <meshBasicMaterial ref={mat} map={tex} toneMapped={false} />;
}

function ScreenVideo({ src, mat }: { src: string; mat: Lit }) {
  const tex = useVideoTexture(src, { muted: true, loop: true, start: true, crossOrigin: "anonymous" });
  return <meshBasicMaterial ref={mat} map={tex} toneMapped={false} />;
}

const frameMat = new THREE.MeshPhysicalMaterial({
  color: "#0b0b0d",
  metalness: 0.2,
  roughness: 0.18,
  clearcoat: 1,
  clearcoatRoughness: 0.08,
});
const edgeMat = new THREE.MeshPhysicalMaterial({
  color: "#c7cad0",
  metalness: 1,
  roughness: 0.22,
});

function Screen({
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
  const screenMat = useRef<THREE.MeshBasicMaterial | null>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const accent = project.brand?.accent ?? "#ff4d2e";
  const dim = useRef(new THREE.Color());

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const v = index - pos.get();
    const a = Math.abs(v);
    const t = Math.min(a, 1);
    const e = t * t * (3 - 2 * t);
    const near = SW / 2 + (SW * SMALL) / 2 + (mobile ? 0.2 : 0.35);
    const far = SW * SMALL * 0.92;
    const off = a <= 1 ? a * near : near + (a - 1) * far;
    const s = 1 - (1 - SMALL) * e;
    // La activa se adelanta; las demás retroceden en arco.
    g.position.set(Math.sign(v) * off, 0, 0.9 * (1 - e) - Math.max(0, a - 1) * 0.5);
    g.scale.setScalar(s);
    g.rotation.y = -Math.max(-0.6, Math.min(0.6, v * 0.38));
    g.visible = a < (mobile ? 1.8 : 3.6);
    // Encendido: la imagen pasa de atenuada a plena al llegar al centro.
    const lum = 0.28 + 0.72 * (1 - e);
    if (screenMat.current) screenMat.current.color.copy(dim.current.setScalar(lum));
    if (glow.current) glow.current.opacity = 0.55 * (1 - e);
  });

  function onClick(ev: ThreeEvent<MouseEvent>) {
    ev.stopPropagation();
    onPick(index);
  }

  const w = SW + FRAME * 2;
  const h = SH + FRAME * 2;

  return (
    <group
      ref={group}
      onClick={onClick}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      <group position={[0, LIFT + h / 2, 0]}>
        {/* Canto de aluminio y panel de vidrio negro. */}
        <RoundedBox args={[w + 0.02, h + 0.02, DEPTH]} radius={DEPTH * 0.45} smoothness={4} material={edgeMat} />
        <RoundedBox args={[w, h, DEPTH + 0.004]} radius={DEPTH * 0.4} smoothness={4} material={frameMat} />
        {/* Imagen del sitio. */}
        <mesh position={[0, 0, DEPTH / 2 + 0.003]}>
          <planeGeometry args={[SW, SH]} />
          <Suspense fallback={<meshBasicMaterial color="#0b0b0c" />}>
            {active && project.video ? (
              <Suspense fallback={<ScreenImage src={imageUrl(project.image)} mat={screenMat} />}>
                <ScreenVideo src={pickVideo(project.video)} mat={screenMat} />
              </Suspense>
            ) : (
              <ScreenImage src={imageUrl(project.image)} mat={screenMat} />
            )}
          </Suspense>
        </mesh>
        {/* Halo del color de la marca detrás de la pantalla encendida. */}
        <mesh position={[0, 0, -DEPTH]} scale={1.18}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial
            ref={glow}
            color={accent}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
            map={glowTexture()}
          />
        </mesh>
      </group>
    </group>
  );
}

// Degradé radial para el halo, generado una sola vez.
let _glow: THREE.Texture | null = null;
function glowTexture() {
  if (_glow) return _glow;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  _glow = new THREE.CanvasTexture(c);
  return _glow;
}

// Agua: mapa de distorsión que se redibuja con ondas suaves y lentas. El
// shader del reflector corre el UV del reflejo según este mapa.
// Una sola textura para toda la página (hay una sola escena).
let _water: THREE.CanvasTexture | null = null;
function waterTexture() {
  if (_water) return _water;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  _water = new THREE.CanvasTexture(c);
  _water.wrapS = _water.wrapT = THREE.RepeatWrapping;
  return _water;
}

function drawWater(time: number) {
  const tex = waterTexture();
  const ctx = (tex.image as HTMLCanvasElement).getContext("2d");
  if (!ctx) return;
  const img = ctx.getImageData(0, 0, 128, 128);
  const d = img.data;
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const v =
        Math.sin(y * 0.42 + time * 1.3) * 0.55 +
        Math.sin(x * 0.11 + y * 0.07 - time * 0.7) * 0.35 +
        Math.sin((x + y) * 0.19 + time * 0.9) * 0.1;
      const i = (y * 128 + x) * 4;
      d[i] = d[i + 1] = d[i + 2] = 128 + v * 110;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  tex.needsUpdate = true;
}

function Water({ mobile }: { mobile: boolean }) {
  const frame = useRef(0);
  // Cada 2 frames alcanza: las ondas son lentas.
  useFrame(({ clock }) => {
    if (frame.current++ % 2 === 0) drawWater(clock.elapsedTime);
  });
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
      <planeGeometry args={[60, 30]} />
      {/* mirror=1: el piso sólo muestra lo que refleja; donde no hay nada,
          queda negro. El color claro es lo que multiplica al reflejo. */}
      <MeshReflectorMaterial
        resolution={mobile ? 512 : 1024}
        blur={[90, 20]}
        mixBlur={0.35}
        mixStrength={1.6}
        mixContrast={1.05}
        mirror={1}
        depthScale={2.2}
        minDepthThreshold={0}
        maxDepthThreshold={1}
        distortionMap={waterTexture()}
        distortion={0.02}
        roughness={1}
        metalness={0}
        color="#8c8c8c"
        envMapIntensity={0}
      />
    </mesh>
  );
}

function CameraRig({ mobile }: { mobile: boolean }) {
  // La pantalla activa manda: la cámara se aleja lo justo para que ocupe
  // ~2/3 del ancho en desktop (casi todo en mobile) sin pasarse de alto.
  // Se recalcula por frame (es barato) para seguir el tamaño del canvas.
  useFrame(({ camera, size }) => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const fov = mobile ? 34 : 30;
    if (cam.fov !== fov) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
    const tanHalf = Math.tan((fov * Math.PI) / 360);
    const fullW = SW + FRAME * 2;
    const fullH = SH + FRAME * 2;
    const byWidth = fullW / ((mobile ? 0.9 : 0.64) * 2 * tanHalf * aspect);
    const byHeight = fullH / ((mobile ? 0.34 : 0.6) * 2 * tanHalf);
    // La activa está adelantada 0.9 hacia la cámara.
    const dist = Math.max(byWidth, byHeight) + 0.9;
    const cy = LIFT + fullH / 2;
    cam.position.set(0, cy + 0.15, dist);
    // Mirar un poco por debajo del centro la ubica en la parte de arriba
    // del cuadro y deja el reflejo a la vista antes de los datos.
    cam.lookAt(0, cy - (mobile ? 1.05 : 0.42), 0);
  });
  return null;
}

export default function ShowcaseScene({
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
      camera={{ fov: 30, near: 0.1, far: 80, position: [0, 1.8, 9] }}
      className="!absolute inset-0"
    >
      <CameraRig mobile={mobile} />
      <fog attach="fog" args={["#000000", 12, 26]} />
      <hemisphereLight args={["#ffffff", "#000000", 0.9]} />
      <Environment resolution={256} frames={1} environmentIntensity={1.2}>
        <Lightformer form="rect" intensity={2.5} position={[0, 5, -3]} rotation-x={Math.PI / 2.2} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-6, 2, 3]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[6, 2, 3]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
      </Environment>
      {projects.map((p, i) => (
        <Screen key={p.slug} project={p} index={i} pos={pos} mobile={mobile} active={i === active} onPick={onPick} />
      ))}
      {/* Piso de agua quieta: negro, con el reflejo apenas ondulado. */}
      <Water mobile={mobile} />
    </Canvas>
  );
}
