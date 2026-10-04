"use client";
/** Hero shell: lazy-loads the 3D scene and shows a live CDM panel driven by it. */
import dynamic from "next/dynamic";
import { useCallback, useRef } from "react";
import type { Status } from "./OrbitScene";

const OrbitScene = dynamic(() => import("./OrbitScene"), { ssr: false });

export default function OrbitHero() {
  const panel = useRef<HTMLDivElement>(null);
  const onStatus = useCallback((s: Status) => {
    const el = panel.current; if (!el) return;
    el.dataset.phase = s.phase;
    (el.querySelector("[data-k=phase]") as HTMLElement).textContent = s.phase;
    (el.querySelector("[data-k=miss]") as HTMLElement).textContent = s.miss.toLocaleString("en-US") + " m";
    (el.querySelector("[data-k=pc]") as HTMLElement).textContent = s.pc;
    (el.querySelector("[data-k=tca]") as HTMLElement).textContent = "T−" + String(s.tca).padStart(2, "0") + " h";
  }, []);
  return (
    <>
      <div className="orbit-canvas" aria-hidden><OrbitScene onStatus={onStatus} /></div>
      <div className="cdm" ref={panel} data-phase="TRACKING" aria-live="off">
        <div className="cdm-h"><span>CDM · SAT-A × SAT-B</span><b data-k="phase">TRACKING</b></div>
        <div className="cdm-r"><span>Miss distance</span><span data-k="miss">— m</span></div>
        <div className="cdm-r"><span>Pc</span><span data-k="pc">—</span></div>
        <div className="cdm-r"><span>TCA</span><span data-k="tca">—</span></div>
        <small>Illustrative replay of the onboard avoidance loop</small>
      </div>
      <div className="tools"><button className="pill" type="button" onClick={() => dispatchEvent(new Event("kessler"))}>Kessler cascade</button></div>
    </>
  );
}
