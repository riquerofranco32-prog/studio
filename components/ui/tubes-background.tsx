"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const TRAIL_LENGTH = 32;
const RADIAL_SEGMENTS = 8;
const TUBE_RADIUS = 0.09;
const GLOW_RADIUS = 0.24;

function readCssColor(varName: string, fallback: string): THREE.Color {
  if (typeof window === "undefined") return new THREE.Color(fallback);
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  try {
    return new THREE.Color(value || fallback);
  } catch {
    return new THREE.Color(fallback);
  }
}

/**
 * Tubo de luz que sigue al cursor, en three.js real (instalado como
 * dependencia, no cargado desde un CDN en runtime). Un único tono —el
 * acento de marca— en vez de colores random: un tubo delgado y opaco más
 * una "carcasa" más ancha y transparente en additive blending detrás,
 * que da el brillo neón sin pase de post-procesado completo.
 *
 * Se pausa solo fuera de pantalla (IntersectionObserver) y no se monta
 * bajo prefers-reduced-motion, igual que components/ui/phosphor-shader.tsx.
 */
export function TubesBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(
      Math.max(1, Math.min(1.5, window.devicePixelRatio || 1)),
    );

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 6;

    const accent = readCssColor("--accent", "#ff4d2e");
    const foreground = readCssColor("--foreground", "#f5f5f5");

    const coreMaterial = new THREE.MeshBasicMaterial({ color: accent });
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: foreground.clone().lerp(accent, 0.5),
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    let coreMesh: THREE.Mesh | null = null;
    let glowMesh: THREE.Mesh | null = null;

    // Historial de posiciones del cursor en espacio del mundo, con
    // suavizado por interpolación en vez de saltar punto a punto.
    const trail: THREE.Vector3[] = Array.from(
      { length: TRAIL_LENGTH },
      () => new THREE.Vector3(0, 0, 0),
    );
    const target = new THREE.Vector2(0, 0);
    const raycastPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const hitPoint = new THREE.Vector3();

    function handlePointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      target.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      target.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let rafId = 0;
    let running = false;

    function tick() {
      if (!running) return;

      raycaster.setFromCamera(target, camera);
      raycaster.ray.intersectPlane(raycastPlane, hitPoint);

      // Cada punto persigue al anterior con lerp: la cola se estira sin
      // saltos cuando el mouse se mueve rápido.
      trail[0].lerp(hitPoint, 0.35);
      for (let i = 1; i < trail.length; i++) {
        trail[i].lerp(trail[i - 1], 0.5);
      }

      const curve = new THREE.CatmullRomCurve3(trail);
      const tubularSegments = 32;

      coreMesh?.geometry.dispose();
      glowMesh?.geometry.dispose();

      const coreGeo = new THREE.TubeGeometry(
        curve,
        tubularSegments,
        TUBE_RADIUS,
        RADIAL_SEGMENTS,
        false,
      );
      const glowGeo = new THREE.TubeGeometry(
        curve,
        tubularSegments,
        GLOW_RADIUS,
        RADIAL_SEGMENTS,
        false,
      );

      if (!coreMesh) {
        coreMesh = new THREE.Mesh(coreGeo, coreMaterial);
        glowMesh = new THREE.Mesh(glowGeo, glowMaterial);
        scene.add(glowMesh);
        scene.add(coreMesh);
      } else {
        coreMesh.geometry = coreGeo;
        glowMesh!.geometry = glowGeo;
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(rafId);
      }
    });
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      coreMesh?.geometry.dispose();
      glowMesh?.geometry.dispose();
      coreMaterial.dispose();
      glowMaterial.dispose();
      renderer.dispose();
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
