import React, { useEffect, useRef, useState } from 'react';

const TEXT_FINAL = "Build Your Capstone Project";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()<>{}[]+=-_~|/";

const KineticHeroHeader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = useState<string>("");
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);

  // 1. Dual-Phase Glyph Decryption Engine
  useEffect(() => {
    let frame = 0;
    const totalFrames = 72; // ~1.2s at 60fps
    const textLength = TEXT_FINAL.length;
    let animationFrameId: number;

    const decryptLoop = () => {
      frame++;
      let currentText = "";
      for (let i = 0; i < textLength; i++) {
        const threshold = (i / textLength) * totalFrames;
        if (frame >= threshold) {
          currentText += TEXT_FINAL[i];
        } else {
          currentText += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setDisplayText(currentText);

      if (frame < totalFrames) {
        animationFrameId = requestAnimationFrame(decryptLoop);
      }
    };

    decryptLoop();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // 2. Telemetry HUD Typewriter Effect
  const SUBTITLE = "Tell us about your skills and interests. Our AI engine will generate a tailored project blueprint with architecture, roadmap, and defense prep.";
  const [subText, setSubText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setSubText(SUBTITLE.slice(0, i));
      i++;
      if (i > SUBTITLE.length) {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 15);
    return () => clearInterval(interval);
  }, []);

  // 3. Interactive Constellation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];
    const numParticles = 40;
    const colors = ['rgba(56, 189, 248, 0.4)', 'rgba(129, 140, 248, 0.4)'];
    
    let width = 0;
    let height = 0;
    let mouseX = 0;
    let mouseY = 0;

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    container.addEventListener('mousemove', onMouseMove);

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Parallax displacement
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x -= (dx / dist) * 1;
          p.y -= (dy / dist) * 1;
        }

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Fade out at borders
        const opacityX = Math.min(p.x, width - p.x) / 50;
        const opacityY = Math.min(p.y, height - p.y) / 50;
        const alphaMulti = Math.min(1, opacityX, opacityY);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('0.4', (0.4 * alphaMulti).toString());
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cDist = Math.sqrt(cdx * cdx + cdy * cdy);
          
          if (cDist < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - cDist / 80) * alphaMulti})`;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        textAlign: 'center', 
        marginBottom: '2.5rem', 
        padding: '3rem 1rem', 
        overflow: 'hidden', 
        borderRadius: '16px',
        border: '1px solid rgba(56, 189, 248, 0.1)',
        background: 'radial-gradient(ellipse at top, rgba(17, 24, 39, 1), rgba(5, 6, 8, 1))'
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none',
          willChange: 'opacity'
        }} 
      />

      <style>
        {`
          @keyframes aurora {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes glowPulse {
            0% { filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.3)); }
            50% { filter: drop-shadow(0 0 25px rgba(129, 140, 248, 0.6)); }
            100% { filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.3)); }
          }
          .kinetic-title {
            background: linear-gradient(90deg, #38bdf8, #818cf8, #c084fc, #2dd4bf, #38bdf8);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: aurora 5s ease infinite, glowPulse 4s ease-in-out infinite;
            will-change: transform, opacity;
            font-family: inherit;
          }
          .hud-cursor {
            display: inline-block;
            width: 8px;
            height: 14px;
            background-color: #38bdf8;
            margin-left: 4px;
            animation: blink 1s step-end infinite;
            vertical-align: middle;
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}
      </style>

      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Telemetry Marks */}
        <div style={{ position: 'absolute', top: -10, left: 0, width: '10px', height: '10px', borderTop: '2px solid rgba(56, 189, 248, 0.3)', borderLeft: '2px solid rgba(56, 189, 248, 0.3)' }} />
        <div style={{ position: 'absolute', top: -10, right: 0, width: '10px', height: '10px', borderTop: '2px solid rgba(56, 189, 248, 0.3)', borderRight: '2px solid rgba(56, 189, 248, 0.3)' }} />

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <div style={{ width: '6px', height: '6px', background: '#2dd4bf', borderRadius: '50%', boxShadow: '0 0 8px #2dd4bf' }} />
          <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#2dd4bf', letterSpacing: '0.1em' }}>SYSTEM READY // V2.4</span>
        </div>

        <h2 
          className="kinetic-title"
          style={{
            fontSize: 'clamp(1.75rem, 5vw, 3rem)',
            fontWeight: 900,
            margin: '0 0 1rem 0',
            letterSpacing: '-0.02em',
            fontFamily: displayText.includes('#') ? 'monospace' : 'inherit'
          }}
        >
          {displayText}
        </h2>

        <p style={{ 
          color: '#94A3B8', 
          fontSize: 'clamp(0.875rem, 2vw, 1.0625rem)', 
          maxWidth: '640px', 
          margin: '0 auto', 
          lineHeight: 1.6,
          fontFamily: 'monospace'
        }}>
          {subText}
          {!isTypingComplete && <span className="hud-cursor" />}
        </p>

        {/* Bottom Telemetry Marks */}
        <div style={{ position: 'absolute', bottom: -10, left: 0, width: '10px', height: '10px', borderBottom: '2px solid rgba(56, 189, 248, 0.3)', borderLeft: '2px solid rgba(56, 189, 248, 0.3)' }} />
        <div style={{ position: 'absolute', bottom: -10, right: 0, width: '10px', height: '10px', borderBottom: '2px solid rgba(56, 189, 248, 0.3)', borderRight: '2px solid rgba(56, 189, 248, 0.3)' }} />
      </div>
    </div>
  );
};

export default KineticHeroHeader;
