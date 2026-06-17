import { useEffect, useRef } from 'react';

export default function StarField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const DPR = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * DPR;
            canvas.height = height * DPR;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        };

        resize();
        window.addEventListener('resize', resize);

        // ⭐ plus visibles
        const stars = Array.from({ length: 220 }).map(() => {
            const z = Math.random();

            return {
                x: Math.random() * width,
                y: Math.random() * height,
                r: 0.6 + Math.random() * 2.2 * (1 - z), // 👈 PLUS GRAND
                speed: 0.03 + Math.random() * 0.08 * (1 - z),
                baseOpacity: 0.25 + Math.random() * 0.6, // 👈 PLUS DENSE
                phase: Math.random() * Math.PI * 2,
                z,
            };
        });

        let mouseX = 0;
        let mouseY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / width - 0.5;
            mouseY = e.clientY / height - 0.5;
        });

        let animId: number;

        const animate = (time: number) => {
            // fond plus doux mais plus visible
            ctx.fillStyle = 'rgba(3, 3, 8, 0.25)';
            ctx.fillRect(0, 0, width, height);

            stars.forEach((star) => {
                star.y += star.speed;

                if (star.y > height) {
                    star.y = 0;
                    star.x = Math.random() * width;
                }

                const parallaxX = mouseX * (40 * star.z);
                const parallaxY = mouseY * (40 * star.z);

                // ✨ twinkle plus présent
                const twinkle = 0.5 + 0.5 * Math.sin(time * 0.002 + star.phase);

                const opacity = star.baseOpacity * twinkle;

                const x = star.x + parallaxX;
                const y = star.y + parallaxY;

                // 💫 glow plus visible
                const glow = star.r * 6;

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, glow);

                gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
                gradient.addColorStop(0.3, `rgba(210, 190, 255, ${opacity * 0.5})`);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.fillStyle = gradient;
                ctx.arc(x, y, star.r, 0, Math.PI * 2);
                ctx.fill();
            });

            animId = requestAnimationFrame(animate);
        };

        animId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 opacity-90" />;
}
