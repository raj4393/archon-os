import React, { useEffect, useRef } from 'react';

const TEXT = "Build Your Capstone Project";

export default function KineticHeroHeader(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const vFluxRef = useRef<HTMLSpanElement>(null);
  const polarRef = useRef<HTMLSpanElement>(null);
  
  // Track cursor velocity for RGB split
  const mouseState = useRef({ x: 0, y: 0, vx: 0, vy: 0, targetSplit: 0, currentSplit: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let w = 0, h = 0;
    const resize = () => {
      w = container.clientWidth;
      h = container.clientHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener('resize', resize);
    
    let lastTime = performance.now();
    let lastX = 0;
    let lastY = 0;
    
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      
      const vx = (x - lastX) / dt;
      const vy = (y - lastY) / dt;
      const speed = Math.sqrt(vx * vx + vy * vy);
      
      mouseState.current.x = x;
      mouseState.current.y = y;
      mouseState.current.vx = vx;
      mouseState.current.vy = vy;
      mouseState.current.targetSplit = Math.min(12, speed * 3);
      
      if (vFluxRef.current) {
        vFluxRef.current.innerText = `[V_FLUX: ${(Math.min(99.9, speed * 20)).toFixed(1)}%]`;
      }
      if (polarRef.current) {
        polarRef.current.innerText = `[POLAR: Ø_${((Math.atan2(y - h/2, x - w/2) * 180) / Math.PI).toFixed(1)}°]`;
      }
      
      lastX = x;
      lastY = y;
      lastTime = now;
    };
    
    container.addEventListener('mousemove', onMouseMove);
    
    // Sparks & Waves state
    const sparks: {x: number, y: number, vx: number, vy: number, life: number, maxLife: number}[] = [];
    let lastSweepTime = performance.now();
    let sweepProgress = -1; // -1 means inactive
    
    let animationId: number;
    
    const render = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      
      // 1. Update RGB split spring physics
      mouseState.current.targetSplit *= 0.92; // rapid decay
      mouseState.current.currentSplit += (mouseState.current.targetSplit - mouseState.current.currentSplit) * 0.15;
      
      if (container) {
         container.style.setProperty('--split-x', `${mouseState.current.currentSplit}px`);
         container.style.setProperty('--split-y', `${mouseState.current.currentSplit * 0.3}px`);
      }
      
      const mx = mouseState.current.x;
      const my = mouseState.current.y;
      
      // 2. Draw Circuit Bus Grid
      ctx.lineWidth = 0.6;
      for (let i = 0; i < h; i += 30) {
        const y = (i + (time / 60)) % h;
        const dist = Math.abs(my - y);
        const near = dist < 60;
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        
        if (near && mx > 0 && mx < w) {
           // Snap to subtle 45-degree cybernetic diagonals
           const dx = Math.max(0, 60 - dist);
           ctx.lineTo(mx - dx, y);
           ctx.lineTo(mx, y - dx * 0.5);
           ctx.lineTo(mx + dx, y);
           ctx.lineTo(w, y);
           ctx.strokeStyle = `rgba(129, 140, 248, ${0.1 + (1 - dist/60) * 0.3})`;
        } else {
           ctx.lineTo(w, y);
           ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
        }
        ctx.stroke();
      }

      // 3. Render Oscilloscope Waveform
      ctx.beginPath();
      for(let i = 0; i < w; i += 4) {
         const dy = Math.sin(time/300 + i/60) * 12 + Math.sin(time/150 + i/25) * 4;
         const cy = h/2 + dy + 15;
         
         if (i === 0) ctx.moveTo(i, cy);
         else ctx.lineTo(i, cy);
      }
      ctx.strokeStyle = `rgba(6, 182, 212, ${0.12 + (mouseState.current.currentSplit * 0.02)})`;
      ctx.stroke();

      // 4. Ion Sweep / Energy Wavefront
      if (time - lastSweepTime > 4500) {
         lastSweepTime = time;
         sweepProgress = 0;
      }
      
      if (sweepProgress >= 0) {
         sweepProgress += 0.015;
         const sweepX = sweepProgress * w;
         
         const gradient = ctx.createLinearGradient(sweepX - 80, 0, sweepX + 80, 0);
         gradient.addColorStop(0, 'rgba(192, 132, 252, 0)');
         gradient.addColorStop(0.5, 'rgba(45, 212, 191, 0.35)');
         gradient.addColorStop(1, 'rgba(192, 132, 252, 0)');
         
         ctx.fillStyle = gradient;
         ctx.fillRect(sweepX - 80, 0, 160, h);
         
         if (sweepProgress > 1.2) sweepProgress = -1;
         
         if (Math.random() > 0.4 && sweepX > 0 && sweepX < w) {
            sparks.push({
               x: sweepX,
               y: h/2 + (Math.random() - 0.5) * 80,
               vx: (Math.random() - 0.5) * 2,
               vy: Math.random() * 1.5 + 0.5,
               life: 0,
               maxLife: Math.random() * 30 + 15
            });
         }
      }
      
      // Render sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
         const p = sparks[i];
         p.life++;
         p.x += p.vx;
         p.y += p.vy;
         
         const alpha = 1 - (p.life / p.maxLife);
         ctx.fillStyle = `rgba(45, 212, 191, ${alpha})`;
         ctx.beginPath();
         ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
         ctx.fill();
         
         if (p.life >= p.maxLife) sparks.splice(i, 1);
      }
      
      animationId = requestAnimationFrame(render);
    };
    
    animationId = requestAnimationFrame(render);
    
    return () => {
       window.removeEventListener('resize', resize);
       container.removeEventListener('mousemove', onMouseMove);
       cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        padding: '4rem 1.5rem',
        marginBottom: '2.5rem',
        borderRadius: '16px',
        border: '1px solid rgba(56, 189, 248, 0.15)',
        background: 'linear-gradient(180deg, #050608 0%, #0a0c12 100%)',
        overflow: 'hidden',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        '--split-x': '0px',
        '--split-y': '0px'
      } as React.CSSProperties}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        
        {/* Architectural HUD Telemetry (Top) */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '720px', 
          fontSize: '10px', fontFamily: 'monospace', color: '#06b6d4', opacity: 0.4, letterSpacing: '0.1em' 
        }}>
           <span ref={vFluxRef}>[V_FLUX: 00.0%]</span>
           <span ref={polarRef}>[POLAR: Ø_00.0°]</span>
        </div>

        {/* Prismatic Dispersion & Chromatic Split Title */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
           {/* Cyan Split */}
           <h2 style={{
             position: 'absolute', top: 'calc(var(--split-y) * -1)', left: 'calc(var(--split-x) * -1)',
             fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900,
             margin: 0, color: '#00f0ff',
             mixBlendMode: 'screen', pointerEvents: 'none',
             filter: 'blur(1px)', opacity: 0.8,
             willChange: 'transform'
           }}>{TEXT}</h2>
           
           {/* Magenta Split */}
           <h2 style={{
             position: 'absolute', top: 'var(--split-y)', left: 'var(--split-x)',
             fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900,
             margin: 0, color: '#ff0070',
             mixBlendMode: 'screen', pointerEvents: 'none',
             filter: 'blur(1px)', opacity: 0.8,
             willChange: 'transform'
           }}>{TEXT}</h2>
           
           {/* Core Text */}
           <h2 style={{
             position: 'relative',
             fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900,
             margin: 0,
             color: '#ffffff',
             textShadow: '0 0 24px rgba(255, 255, 255, 0.25)'
           }}>{TEXT}</h2>
        </div>
        
        <p style={{
          color: '#cbd5e1',
          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
          maxWidth: '42rem',
          margin: '0 auto',
          lineHeight: 1.625,
          textAlign: 'center',
          letterSpacing: '0.025em',
          fontWeight: 400
        }}>
          Architect production-grade capstone systems across any engineering discipline—complete with technical blueprints, execution roadmaps, and review-ready defense strategies.
        </p>

        {/* Bottom HUD */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '720px', gap: '1rem', marginTop: '0.5rem' }}>
           <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(129, 140, 248, 0.4))' }} />
           <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#818cf8', letterSpacing: '0.15em', opacity: 0.4 }}>SYS.OPT // ACTIVE</span>
           <div style={{ flex: 1, height: '1px', background: 'linear-gradient(270deg, transparent, rgba(129, 140, 248, 0.4))' }} />
        </div>
        
      </div>
    </div>
  );
}
