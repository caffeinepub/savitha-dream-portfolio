import { useEffect, useRef } from "react";

interface Arc {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  segments: number;
  opacity: number;
  width: number;
  life: number;
  maxLife: number;
  color: string;
}

function createArc(width: number, height: number): Arc {
  // Mostly vertical lightning arcs
  const isVertical = Math.random() > 0.3;
  let x1: number;
  let y1: number;
  let x2: number;
  let y2: number;

  if (isVertical) {
    x1 = Math.random() * width;
    y1 = Math.random() * height * 0.4;
    x2 = x1 + (Math.random() - 0.5) * 200;
    y2 = y1 + Math.random() * 300 + 100;
  } else {
    x1 = Math.random() * width;
    y1 = Math.random() * height;
    x2 = x1 + (Math.random() - 0.5) * 400;
    y2 = y1 + (Math.random() - 0.5) * 100;
  }

  const colors = ["#0066ff", "#00aaff", "#0044cc", "#00ccff", "#003399"];
  const maxLife = 30 + Math.random() * 60;

  return {
    x1,
    y1,
    x2,
    y2,
    segments: Math.floor(4 + Math.random() * 8),
    opacity: 0,
    width: 0.3 + Math.random() * 0.8,
    life: 0,
    maxLife,
    color: colors[Math.floor(Math.random() * colors.length)],
  };
}

function drawLightningArc(
  ctx: CanvasRenderingContext2D,
  arc: Arc,
  seed: number,
) {
  const { x1, y1, x2, y2, segments, opacity, width, color } = arc;
  if (opacity <= 0) return;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.shadowBlur = 8;
  ctx.shadowColor = "#00aaff";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Generate jagged lightning path
  const points: [number, number][] = [[x1, y1]];

  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const baseX = x1 + (x2 - x1) * t;
    const baseY = y1 + (y2 - y1) * t;
    const jitter = ((seed * i * 7919) % 100) / 100;
    const offsetX = (jitter - 0.5) * 60;
    const offsetY = (((seed * i * 6271) % 100) / 100 - 0.5) * 30;
    points.push([baseX + offsetX, baseY + offsetY]);
  }
  points.push([x2, y2]);

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.stroke();

  // Draw a brighter core
  ctx.globalAlpha = opacity * 0.5;
  ctx.strokeStyle = "#aaddff";
  ctx.lineWidth = width * 0.4;
  ctx.shadowBlur = 4;
  ctx.stroke();

  ctx.restore();
}

export default function ElectricCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const arcsRef = useRef<Arc[]>([]);
  const seedRef = useRef<number>(Math.floor(Math.random() * 10000));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize arcs
    const maxArcs = 8;
    arcsRef.current = Array.from({ length: maxArcs }, () =>
      createArc(canvas.width, canvas.height),
    );

    let frameCount = 0;

    const loop = () => {
      frameRef.current = requestAnimationFrame(loop);
      frameCount++;

      // Clear with a subtle trail effect
      ctx.fillStyle = "rgba(2, 11, 24, 0.85)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Occasionally spawn a new arc
      if (frameCount % 20 === 0) {
        const deadIdx = arcsRef.current.findIndex((a) => a.life >= a.maxLife);
        if (deadIdx !== -1) {
          arcsRef.current[deadIdx] = createArc(canvas.width, canvas.height);
          seedRef.current = (seedRef.current * 1103515245 + 12345) % 2147483648;
        }
      }

      // Update and draw arcs
      arcsRef.current.forEach((arc, i) => {
        arc.life++;
        const progress = arc.life / arc.maxLife;

        // Fade in/out
        if (progress < 0.2) {
          arc.opacity = (progress / 0.2) * 0.55;
        } else if (progress < 0.8) {
          arc.opacity = 0.55;
        } else {
          arc.opacity = ((1 - progress) / 0.2) * 0.55;
        }

        const arcSeed =
          (seedRef.current * (i + 1) * 1103515245 + 12345) % 2147483648;
        drawLightningArc(ctx, arc, arcSeed);
      });
    };

    loop();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      tabIndex={-1}
    />
  );
}
