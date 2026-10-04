"use client";
/**
 * Real-time 3D hero: a dotted Earth, a shell of orbiting debris, and two satellites on
 * crossing orbits. Every ~12 s they reach a conjunction: a red link appears, the CDM panel
 * goes CRITICAL, the amber satellite burns to a higher orbit, and the risk clears.
 * That is the core of the KAUST research, played live.
 *
 * Mouse tilts the globe. Scrolling past the hero pulls the camera back.
 * "Kessler cascade" (window event) blows the debris shell outward, then it settles.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const css = (n: string, d: string) => (typeof window === "undefined" ? d : getComputedStyle(document.documentElement).getPropertyValue(n).trim() || d);
const ll = (lon: number, lat: number, r: number) => {
  const phi = (90 - lat) * (Math.PI / 180), th = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
};
const PLACES: [number, number][] = [[74.3, 31.5], [39.1, 22.3], [116.4, 39.9], [46.7, 24.7]];

export type Status = { phase: "TRACKING" | "CRITICAL" | "MANOEUVRE" | "CLEARED"; miss: number; pc: string; tca: number };

/* ---------- Earth ---------- */
function Earth({ colors }: { colors: Record<string, string> }) {
  const [dots, setDots] = useState<Float32Array | null>(null);
  useEffect(() => {
    fetch("/earth-dots.json").then((r) => r.json()).then((a: number[]) => {
      const p = new Float32Array((a.length / 2) * 3);
      for (let i = 0; i < a.length; i += 2) { const v = ll(a[i], a[i + 1], 1.002); p.set([v.x, v.y, v.z], (i / 2) * 3); }
      setDots(p);
    });
  }, []);
  const glow = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { c: { value: new THREE.Color(colors.cyan) } },
    vertexShader: "varying vec3 n; varying vec3 v; void main(){ n=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); v=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }",
    fragmentShader: "uniform vec3 c; varying vec3 n; varying vec3 v; void main(){ float f=pow(1.-abs(dot(n,v)),5.); gl_FragColor=vec4(c,f*0.55); }",
    transparent: true, blending: THREE.AdditiveBlending, side: THREE.FrontSide, depthWrite: false,
  }), [colors.cyan]);
  const rings = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    rings.current?.children.forEach((m, i) => { const s = 1 + ((clock.elapsedTime * 0.6 + i * 0.25) % 1) * 2.5; m.scale.setScalar(s); ((m as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 1 - ((clock.elapsedTime * 0.6 + i * 0.25) % 1); });
  });
  return (
    <>
      <mesh><sphereGeometry args={[1, 64, 64]} /><meshBasicMaterial color={colors.deep} /></mesh>
      <mesh scale={1.06} material={glow}><sphereGeometry args={[1, 64, 64]} /></mesh>
      {dots && (
        <points>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[dots, 3]} /></bufferGeometry>
          <pointsMaterial size={0.012} color={colors.cyan} transparent opacity={0.85} sizeAttenuation />
        </points>
      )}
      <group ref={rings}>
        {PLACES.map(([lo, la], i) => {
          const p = ll(lo, la, 1.01);
          return (
            <mesh key={i} position={p} onUpdate={(m) => m.lookAt(p.clone().multiplyScalar(2))}>
              <ringGeometry args={[0.012, 0.018, 24]} /><meshBasicMaterial color={colors.amber} transparent side={THREE.DoubleSide} />
            </mesh>
          );
        })}
      </group>
      {PLACES.map(([lo, la], i) => (
        <mesh key={i} position={ll(lo, la, 1.01)}><sphereGeometry args={[0.012, 8, 8]} /><meshBasicMaterial color={colors.amber} /></mesh>
      ))}
    </>
  );
}

/* ---------- Debris shell ---------- */
function Debris({ colors, kessler }: { colors: Record<string, string>; kessler: React.MutableRefObject<number> }) {
  const N = 1800;
  const { pos, el } = useMemo(() => {
    const el = new Float32Array(N * 4); // radius, inclination, raan, phase
    for (let i = 0; i < N; i++) el.set([1.18 + Math.random() * 0.5, (Math.random() - 0.5) * Math.PI, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2], i * 4);
    return { pos: new Float32Array(N * 3), el };
  }, []);
  const geo = useRef<THREE.BufferGeometry>(null);
  const v = new THREE.Vector3();
  useFrame((_, dt) => {
    const k = kessler.current; // 0..1 blast amount, decays
    kessler.current = Math.max(0, k - dt * 0.35);
    for (let i = 0; i < N; i++) {
      const r = el[i * 4] * (1 + k * k * 1.6 * (0.5 + (i % 7) / 7)), inc = el[i * 4 + 1], raan = el[i * 4 + 2];
      el[i * 4 + 3] += dt * (0.9 / Math.pow(el[i * 4], 1.5)) * 0.35;
      const ph = el[i * 4 + 3];
      v.set(Math.cos(ph) * r, 0, Math.sin(ph) * r).applyAxisAngle(new THREE.Vector3(1, 0, 0), inc).applyAxisAngle(new THREE.Vector3(0, 1, 0), raan);
      pos.set([v.x, v.y, v.z], i * 3);
    }
    if (geo.current) geo.current.attributes.position.needsUpdate = true;
  });
  return (
    <points>
      <bufferGeometry ref={geo}><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry>
      <pointsMaterial size={0.009} color={colors.muted} transparent opacity={0.75} sizeAttenuation />
    </points>
  );
}

/* ---------- Conjunction: two satellites, one manoeuvres ---------- */
const CYCLE = 12;
function orbitPoint(r: number, inc: number, ph: number, out: THREE.Vector3) {
  return out.set(Math.cos(ph) * r, 0, Math.sin(ph) * r).applyAxisAngle(new THREE.Vector3(1, 0, 0), inc);
}
function Conjunction({ colors, onStatus }: { colors: Record<string, string>; onStatus: (s: Status) => void }) {
  const a = useRef<THREE.Group>(null), b = useRef<THREE.Group>(null), flash = useRef<THREE.Mesh>(null);
  const last = useRef("");
  const R = 1.42, incA = 0.5, incB = -0.65;
  const ringA = useMemo(() => new THREE.BufferGeometry().setFromPoints(Array.from({ length: 129 }, (_, i) => orbitPoint(R, incA, (i / 128) * Math.PI * 2, new THREE.Vector3()))), []);
  const ringB = useMemo(() => new THREE.BufferGeometry().setFromPoints(Array.from({ length: 129 }, (_, i) => orbitPoint(R, incB, (i / 128) * Math.PI * 2, new THREE.Vector3()))), []);
  const linkGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), []);
  const trailGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(Array.from({ length: 40 }, () => new THREE.Vector3())), []);
  const link = useRef(new THREE.Line(linkGeo, new THREE.LineBasicMaterial({ color: colors.red })));
  const trail = useRef(new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: colors.amber, transparent: true, opacity: 0.8 })));
  const pa = new THREE.Vector3(), pb = new THREE.Vector3();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime % CYCLE, u = t / CYCLE;
    // both reach the node (phase 0 on the shared x axis) at u = 0.5
    const ph = (u - 0.5) * Math.PI * 1.1;
    const burn = u > 0.42 ? Math.min(1, (u - 0.42) / 0.12) : 0;
    const rA = R + burn * 0.16 * (u < 0.96 ? 1 : 1 - (u - 0.96) / 0.04);
    orbitPoint(rA, incA, ph, pa); orbitPoint(R, incB, ph + 0.02, pb);
    a.current?.position.copy(pa); b.current?.position.copy(pb);
    a.current?.lookAt(0, 0, 0); b.current?.lookAt(0, 0, 0);
    const d = pa.distanceTo(pb);
    const phase: Status["phase"] = u < 0.3 ? "TRACKING" : u < 0.42 ? "CRITICAL" : u < 0.58 ? "MANOEUVRE" : "CLEARED";
    if (link.current) {
      link.current.visible = phase === "CRITICAL" || phase === "MANOEUVRE";
      const p = linkGeo.attributes.position as THREE.BufferAttribute; p.setXYZ(0, pa.x, pa.y, pa.z); p.setXYZ(1, pb.x, pb.y, pb.z); p.needsUpdate = true;
    }
    if (flash.current) {
      flash.current.visible = phase === "CRITICAL";
      flash.current.position.copy(pa).lerp(pb, 0.5);
      flash.current.scale.setScalar(0.05 + ((clock.elapsedTime * 2) % 1) * 0.12);
    }
    if (trail.current) {
      trail.current.visible = burn > 0 && u < 0.7;
      const p = trailGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < 40; i++) { const v = orbitPoint(R + burn * 0.16 * (1 - i / 40), incA, ph - i * 0.012, new THREE.Vector3()); p.setXYZ(i, v.x, v.y, v.z); }
      p.needsUpdate = true;
    }
    const key = phase + Math.round(u * 40);
    if (key !== last.current) {
      last.current = key;
      const miss = phase === "CLEARED" ? Math.round(65 + burn * 2400) : Math.max(65, Math.round(849 - u * 1500));
      onStatus({ phase, miss, pc: phase === "CLEARED" ? "3.2e-7" : u < 0.3 ? "1.1e-4" : "1.7e-3", tca: Math.max(0, Math.round((1 - u) * 72)) });
    }
    void d;
  });
  const Sat = ({ c }: { c: string }) => (
    <>
      <group scale={1.8}><mesh><boxGeometry args={[0.03, 0.03, 0.03]} /><meshBasicMaterial color={colors.text} /></mesh>
      <mesh position={[0.045, 0, 0]}><boxGeometry args={[0.05, 0.004, 0.02]} /><meshBasicMaterial color={c} /></mesh>
      <mesh position={[-0.045, 0, 0]}><boxGeometry args={[0.05, 0.004, 0.02]} /><meshBasicMaterial color={c} /></mesh></group>
    </>
  );
  return (
    <>
      <lineLoop geometry={ringA}><lineBasicMaterial color={colors.amber} transparent opacity={0.35} /></lineLoop>
      <lineLoop geometry={ringB}><lineBasicMaterial color={colors.cyan} transparent opacity={0.3} /></lineLoop>
      <group ref={a}><Sat c={colors.amber} /></group>
      <group ref={b}><Sat c={colors.cyan} /></group>
      <primitive object={link.current} />
      <primitive object={trail.current} />
      <mesh ref={flash}><sphereGeometry args={[1, 16, 16]} /><meshBasicMaterial color={colors.red} transparent opacity={0.35} /></mesh>
    </>
  );
}

function Offset({ children }: { children: React.ReactNode }) {
  const { size } = useThree();
  const mobile = size.width < 760;
  return <group position={mobile ? [0, 1.15, 0] : [1.25, 0, 0]}>{children}</group>;
}

/* ---------- camera rig: mouse tilt + scroll pull-back ---------- */
function Rig({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const { camera, pointer } = useThree();
  useFrame((_, dt) => {
    const sc = Math.min(1, window.scrollY / window.innerHeight);
    const mobile = window.innerWidth < 760;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, (mobile ? 5.2 : 4.3) + sc * 2.2, 4, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.35 + sc * 0.9, 4, dt);
    camera.lookAt(0, 0, 0);
    if (g.current) {
      g.current.rotation.y += dt * 0.06;
      g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, 0.41 + pointer.y * 0.25, 3, dt);
      g.current.rotation.z = THREE.MathUtils.damp(g.current.rotation.z, -pointer.x * 0.15, 3, dt);
    }
  });
  return <group ref={g}>{children}</group>;
}

export default function OrbitScene({ onStatus }: { onStatus: (s: Status) => void }) {
  const kessler = useRef(0);
  const [colors, setColors] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    const read = () => setColors({ cyan: css("--cyan", "#5ec8e5"), amber: css("--amber", "#ffb347"), red: css("--red", "#ff6b6b"), muted: css("--muted", "#9fb1c6"), text: css("--text", "#e7eef6"), deep: css("--deep", "#0a1626") });
    read();
    const mo = new MutationObserver(read); mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const k = () => (kessler.current = 1);
    addEventListener("kessler", k);
    return () => { mo.disconnect(); removeEventListener("kessler", k); };
  }, []);
  if (!colors) return null;
  return (
    <Canvas camera={{ position: [0, 0.35, 3.3], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} style={{ position: "absolute", inset: 0 }}>
      <Rig>
        <Offset>
          <Earth colors={colors} />
          <Debris colors={colors} kessler={kessler} />
          <Conjunction colors={colors} onStatus={onStatus} />
        </Offset>
      </Rig>
    </Canvas>
  );
}
