"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  RoundedBox,
  useTexture,
  useVideoTexture,
} from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import type { Project } from "@/types";

// Vidriera 3D de la rueda de Trabajo: pantallas de vidrio con canto de
// aluminio flotando en un cuarto negro, sobre agua quieta. El scroll gira la
// rueda: la pantalla que llega al centro se adelanta y se enciende; las de
// los costados quedan atenuadas, giradas en arco.
//
// No hay un piso físico: un piso tiene borde y color, y se nota el corte
// contra el fondo. El agua es el reflejo de cada pantalla, dibujado invertido
// debajo de ella con su misma imagen (o clip), ondulado y desvanecido. No
// depende de la luz de la escena, así que es negro puro donde no refleja nada.

// Pantalla 16:10 en unidades de escena. Ojo con RoundedBox: el radio tiene
// que ser menor que la mitad del lado más chico, si no la geometría se infla.
const SW = 3.2;
const SH = SW * (10 / 16);
const FRAME = 0.07; // marco negro alrededor de la imagen
const DEPTH = 0.07; // espesor del panel
const LIFT = 0.04; // altura sobre el agua

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

// Reflejo en el agua: la imagen invertida, como la devuelve una superficie
// oscura y quieta. Tres cosas lo hacen creíble:
//  - Ondas: una distorsión de ruido animado que crece al alejarse de la línea
//    del agua (cerca de la pantalla el agua está más quieta).
//  - Desenfoque: el reflejo se ablanda con la distancia, más en vertical que
//    en horizontal, como las estelas de luz sobre el agua.
//  - Brillos: las crestas de las ondas levantan la luz con el color de la
//    propia pantalla, en líneas finas que se mueven.
// El color se mantiene saturado (el agua oscura no lo lava a gris) y todo se
// desvanece hacia abajo hasta el negro del cuarto.
const waterVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const waterFragment = /* glsl */ `
  uniform sampler2D map;
  uniform float time;
  uniform float lum;
  // Onda del cursor: punto (en uv del reflejo) y fuerza, que se apaga sola.
  uniform vec2 mouse;
  uniform float ripple;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    // v = 0 es el borde de abajo de la pantalla, el que toca el agua.
    float far = vUv.y;

    // Ondas: ruido estirado en horizontal (el agua ondula en franjas), que
    // corre despacio hacia la cámara.
    vec2 q = vec2(vUv.x * 5.0, far * 26.0 - time * 0.9);
    float n1 = noise(q + vec2(time * 0.15, 0.0));
    float n2 = noise(q * 2.3 - vec2(0.0, time * 0.6));
    float n = n1 * 0.65 + n2 * 0.35;
    float amp = 0.004 + far * 0.022;
    vec2 uv = vUv + vec2((n - 0.5) * amp, (n2 - 0.5) * amp * 0.6);

    // El cursor toca el agua: anillos concéntricos que se abren desde el
    // punto y empujan el reflejo hacia afuera. El reflejo es 16:10, así que
    // la distancia se corrige para que los anillos sean redondos.
    vec2 dm = (vUv - mouse) * vec2(1.6, 1.0);
    float dist = length(dm);
    float wave = sin(dist * 48.0 - time * 7.0);
    float rings = wave * exp(-dist * 5.0) * ripple;
    uv += (dm / max(dist, 1e-4)) * rings * 0.024;

    // Desenfoque: ya suave al pie de la pantalla y cada vez más abierto.
    // 13 muestras en dos anillos, estirados en vertical.
    float r = 0.012 + far * 0.06;
    vec2 ry = vec2(0.0, r), rx = vec2(r * 0.55, 0.0);
    vec3 c = texture2D(map, uv).rgb * 0.12;
    c += texture2D(map, uv + ry * 0.45).rgb * 0.09;
    c += texture2D(map, uv - ry * 0.45).rgb * 0.09;
    c += texture2D(map, uv + rx * 0.45).rgb * 0.07;
    c += texture2D(map, uv - rx * 0.45).rgb * 0.07;
    c += texture2D(map, uv + (rx + ry) * 0.5).rgb * 0.06;
    c += texture2D(map, uv - (rx + ry) * 0.5).rgb * 0.06;
    c += texture2D(map, uv + (rx - ry) * 0.5).rgb * 0.06;
    c += texture2D(map, uv - (rx - ry) * 0.5).rgb * 0.06;
    c += texture2D(map, uv + ry).rgb * 0.08;
    c += texture2D(map, uv - ry).rgb * 0.08;
    c += texture2D(map, uv + rx).rgb * 0.08;
    c += texture2D(map, uv - rx).rgb * 0.08;

    // Color: más saturado y con algo de contraste, para que un sitio claro
    // no se refleje como una mancha gris.
    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
    c = mix(vec3(l), c, 1.35);
    c = max(c, 0.0);
    c = pow(c, vec3(1.12));

    // Brillos en las crestas, del color de lo que se refleja.
    float crest = smoothstep(0.62, 0.9, n) * (0.35 + 0.65 * smoothstep(0.0, 0.25, far));
    float lines = 0.5 + 0.5 * sin(far * 170.0 + n * 9.0 - time * 2.4);
    c *= 0.82 + 0.5 * crest * lines;
    // Las crestas de la onda del cursor levantan luz, y el punto de contacto
    // brilla un poco.
    c *= 1.0 + rings * 0.8;
    // Filo de luz en cada anillo, del color del reflejo más un poco de blanco.
    float edge = pow(max(wave, 0.0), 10.0) * exp(-dist * 4.5) * ripple;
    c += (c * 0.8 + vec3(0.08)) * edge;
    c += c * exp(-dist * 12.0) * ripple * 0.6;

    // Tinte muy leve de agua profunda en lo oscuro.
    c += vec3(0.0, 0.006, 0.012) * (1.0 - l);

    // Más fuerte al pie de la pantalla y apagado hacia el fondo.
    float fade = pow(1.0 - far, 1.8) * mix(0.5, 0.26, far);
    fade = min(1.0, fade + edge * 0.35);
    gl_FragColor = vec4(c * lum * 0.8, fade);
    #include <colorspace_fragment>
  }
`;

type Refs = {
  screenRef: React.Ref<THREE.MeshBasicMaterial>;
  waterRef: React.Ref<THREE.ShaderMaterial>;
};

function Surfaces({ tex, screenRef, waterRef }: { tex: THREE.Texture } & Refs) {
  // Cada textura monta su propio Surfaces (imagen o clip), así que los
  // uniforms nacen ya con su mapa.
  const [uniforms] = useState(() => ({
    map: { value: tex },
    time: { value: 0 },
    lum: { value: 1 },
    mouse: { value: new THREE.Vector2(0.5, 0.2) },
    ripple: { value: 0 },
  }));

  // Pasar el cursor (o tocar) el agua la agita en ese punto. La fuerza se
  // apaga sola en el useFrame de Screen.
  function stir(e: ThreeEvent<PointerEvent>) {
    const u = ((e.eventObject as THREE.Mesh).material as THREE.ShaderMaterial)
      .uniforms;
    if (!e.uv || !u) return;
    u.mouse.value.copy(e.uv);
    u.ripple.value = Math.min(1, u.ripple.value + 0.35);
  }

  return (
    <>
      {/* Imagen del sitio. */}
      <mesh position={[0, LIFT + (SH + FRAME * 2) / 2, DEPTH / 2 + 0.003]}>
        <planeGeometry args={[SW, SH]} />
        <meshBasicMaterial ref={screenRef} map={tex} toneMapped={false} />
      </mesh>
      {/* Su reflejo, espejado bajo la línea del agua (y = 0). */}
      <group scale={[1, -1, 1]}>
        <mesh
          position={[0, LIFT + (SH + FRAME * 2) / 2, DEPTH / 2 + 0.003]}
          onPointerMove={stir}
          onPointerDown={stir}
        >
          <planeGeometry args={[SW, SH]} />
          <shaderMaterial
            ref={waterRef}
            uniforms={uniforms}
            vertexShader={waterVertex}
            fragmentShader={waterFragment}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </>
  );
}

function ImageSurfaces({ src, ...refs }: { src: string } & Refs) {
  // Color y nitidez se ajustan en la carga, dentro del propio hook.
  const tex = useTexture(src, (t) => {
    const one = Array.isArray(t) ? t[0] : t;
    one.colorSpace = THREE.SRGBColorSpace;
    one.anisotropy = 8;
  });
  return <Surfaces tex={tex} {...refs} />;
}

function VideoSurfaces({
  src,
  poster,
  ...refs
}: { src: string; poster: string } & Refs) {
  const tex = useVideoTexture(src, {
    muted: true,
    loop: true,
    start: true,
    crossOrigin: "anonymous",
  });
  // El clip "carga" antes de tener un cuadro decodificado: hasta que avanza
  // sigue la captura, si no la pantalla pasa un instante a negro.
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const v = tex.image as HTMLVideoElement;
    const on = () => {
      if (v.currentTime > 0) setPlaying(true);
    };
    v.addEventListener("timeupdate", on);
    return () => v.removeEventListener("timeupdate", on);
  }, [tex]);
  return playing ? (
    <Surfaces tex={tex} {...refs} />
  ) : (
    <ImageSurfaces src={poster} {...refs} />
  );
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
// Reflejo del canto: apagado y desvanecido con la profundidad bajo el agua,
// igual que la imagen, para que no dibuje un rectángulo con borde.
const edgeReflMat = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  vertexShader: /* glsl */ `
    varying float vY;
    void main() {
      vec4 w = modelMatrix * vec4(position, 1.0);
      vY = w.y;
      gl_Position = projectionMatrix * viewMatrix * w;
    }
  `,
  fragmentShader: /* glsl */ `
    varying float vY;
    void main() {
      float fade = pow(clamp(1.0 + vY / 0.9, 0.0, 1.0), 2.0) * 0.5;
      // Aluminio visto en el agua: frío y apagado, no gris plano.
      gl_FragColor = vec4(vec3(0.16, 0.18, 0.22), fade);
      #include <colorspace_fragment>
    }
  `,
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
  const screen = useRef<THREE.MeshBasicMaterial | null>(null);
  const water = useRef<THREE.ShaderMaterial | null>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const pool = useRef<THREE.MeshBasicMaterial>(null);
  const accent = project.brand?.accent ?? "#ff4d2e";

  useFrame(({ clock }, delta) => {
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
    g.position.set(
      Math.sign(v) * off,
      0,
      0.9 * (1 - e) - Math.max(0, a - 1) * 0.5,
    );
    g.scale.setScalar(s);
    g.rotation.y = -Math.max(-0.6, Math.min(0.6, v * 0.38));
    g.visible = a < (mobile ? 1.8 : 3.6);
    // Encendido: la imagen pasa de atenuada a plena al llegar al centro.
    const lum = 0.26 + 0.74 * (1 - e);
    screen.current?.color.setScalar(lum);
    const w = water.current;
    if (w) {
      w.uniforms.lum.value = lum;
      w.uniforms.time.value = clock.elapsedTime + index * 3.1;
      // La onda del cursor se calma en ~2 s.
      w.uniforms.ripple.value *= Math.pow(0.2, delta);
    }
    if (glow.current) glow.current.opacity = 0.35 * (1 - e);
    if (pool.current) pool.current.opacity = 0.16 * (1 - e);
  });

  function onClick(ev: ThreeEvent<MouseEvent>) {
    ev.stopPropagation();
    onPick(index);
  }

  const w = SW + FRAME * 2;
  const h = SH + FRAME * 2;
  const glowMap = glowTexture();

  return (
    <group
      ref={group}
      onClick={onClick}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      {/* Canto de aluminio y panel de vidrio negro. */}
      <group position={[0, LIFT + h / 2, 0]}>
        <RoundedBox
          args={[w + 0.02, h + 0.02, DEPTH]}
          radius={DEPTH * 0.45}
          smoothness={4}
          material={edgeMat}
        />
        <RoundedBox
          args={[w, h, DEPTH + 0.004]}
          radius={DEPTH * 0.4}
          smoothness={4}
          material={frameMat}
        />
        {/* Halo del color de la marca detrás de la pantalla encendida. */}
        <mesh position={[0, 0, -DEPTH]} scale={1.2}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial
            ref={glow}
            color={accent}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
            map={glowMap}
          />
        </mesh>
      </group>
      {/* El canto también se refleja: sin él, entre la pantalla y su reflejo
          queda un hueco que delata que no hay agua. */}
      <group scale={[1, -1, 1]}>
        <group position={[0, LIFT + h / 2, 0]}>
          <RoundedBox
            args={[w + 0.02, h + 0.02, DEPTH]}
            radius={DEPTH * 0.45}
            smoothness={4}
            material={edgeReflMat}
          />
        </group>
      </group>

      {/* Imagen y su reflejo en el agua. */}
      <Suspense fallback={null}>
        {active && project.video ? (
          <Suspense
            fallback={
              <ImageSurfaces
                src={imageUrl(project.image)}
                screenRef={screen}
                waterRef={water}
              />
            }
          >
            <VideoSurfaces
              src={pickVideo(project.video)}
              poster={imageUrl(project.image)}
              screenRef={screen}
              waterRef={water}
            />
          </Suspense>
        ) : (
          <ImageSurfaces
            src={imageUrl(project.image)}
            screenRef={screen}
            waterRef={water}
          />
        )}
      </Suspense>

      {/* Luz del foco sobre el agua, al pie de la pantalla encendida. */}
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0.001, 0.9]}
        scale={[w * 1.5, 2.6, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={pool}
          color={accent}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
          map={glowMap}
        />
      </mesh>
    </group>
  );
}

// Degradé radial para halos y luz del foco, generado una sola vez.
let _glow: THREE.Texture | null = null;
function glowTexture() {
  if (_glow) return _glow;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.5, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  _glow = new THREE.CanvasTexture(c);
  return _glow;
}

/**
 * Con frameloop "never" el primer cuadro se dibujaba recién cuando la sección
 * entraba en pantalla, y ahí compilaba todos los shaders y el mapa de entorno
 * de golpe: medido, ~800 ms de getProgramInfoLog en pleno scroll. Esto hace
 * ese trabajo antes, con la escena montada pero todavía fuera de vista.
 */
function Warmup({ live }: { live: boolean }) {
  const { gl, scene, camera, advance } = useThree();
  useEffect(() => {
    if (live) return;
    let cancelled = false;
    // ponytail: las texturas de cada pantalla llegan por Suspense a destiempo,
    // así que se repite un par de veces; compilar lo ya compilado es gratis.
    const run = async () => {
      await gl.compileAsync(scene, camera);
      // Dibujar el cuadro es sincrónico: se espera a que el navegador esté libre.
      const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
      if (!cancelled) idle(() => !cancelled && advance(performance.now()), { timeout: 1500 });
    };
    const timers = [0, 2000, 5000].map((ms) => window.setTimeout(run, ms));
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [live, gl, scene, camera, advance]);
  return null;
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
    const byWidth = fullW / ((mobile ? 0.9 : 0.58) * 2 * tanHalf * aspect);
    const byHeight = fullH / ((mobile ? 0.34 : 0.54) * 2 * tanHalf);
    // La activa está adelantada 0.9 hacia la cámara.
    const dist = Math.max(byWidth, byHeight) + 0.9;
    const cy = LIFT + fullH / 2;
    cam.position.set(0, cy + 0.15, dist);
    // Mirar un poco por debajo del centro la ubica en la parte de arriba
    // del cuadro y deja el reflejo a la vista antes de los datos.
    cam.lookAt(0, cy - (mobile ? 1.05 : 0.6), 0);
  });
  return null;
}

export default function ShowcaseScene({
  projects,
  pos,
  active,
  mobile,
  live,
  onPick,
}: {
  projects: Project[];
  pos: MotionValue<number>;
  active: number;
  mobile: boolean;
  /** false: la sección no está a la vista; la escena no dibuja cuadros. */
  live: boolean;
  onPick: (i: number) => void;
}) {
  return (
    <Canvas
      frameloop={live ? "always" : "never"}
      // 1.5 alcanza para pantallas retina: a 2 el shader del agua procesa
      // casi el doble de píxeles por cuadro sin diferencia a la vista.
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 30, near: 0.1, far: 80, position: [0, 1.8, 9] }}
      className="!absolute inset-0"
    >
      <Warmup live={live} />
      <CameraRig mobile={mobile} />
      {/* Foco de frente, alto: hace brillar los cantos de aluminio. */}
      <spotLight
        position={[0, 6, 10]}
        angle={0.5}
        penumbra={1}
        intensity={80}
        distance={40}
        decay={2}
      />
      <Environment resolution={256} frames={1} environmentIntensity={1}>
        <Lightformer
          form="rect"
          intensity={2.5}
          position={[0, 5, 6]}
          rotation-x={-Math.PI / 3}
          scale={[10, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1}
          position={[-6, 2, 3]}
          rotation-y={Math.PI / 2}
          scale={[8, 2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1}
          position={[6, 2, 3]}
          rotation-y={-Math.PI / 2}
          scale={[8, 2, 1]}
        />
      </Environment>
      {projects.map((p, i) => (
        <Screen
          key={p.slug}
          project={p}
          index={i}
          pos={pos}
          mobile={mobile}
          active={live && i === active}
          onPick={onPick}
        />
      ))}
    </Canvas>
  );
}
