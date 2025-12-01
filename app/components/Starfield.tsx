"use client";

import React, { useEffect, useRef } from "react";

interface StarfieldProps {
    speedRef?: React.MutableRefObject<number>;
    starColorRef?: React.MutableRefObject<string>;
}

const Starfield = ({ speedRef, starColorRef }: StarfieldProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const stars: { x: number; y: number; z: number; size: number }[] = [];
        const isMobile = width < 768;
        const numStars = isMobile ? 50 : 800; // Drastically reduce stars on mobile
        // Use internal speed if no ref provided, but initialize from ref if present
        let internalSpeed = speedRef ? speedRef.current : 0.5;
        let scrollY = 0;

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width - width / 2,
                y: Math.random() * height - height / 2,
                z: Math.random() * width,
                size: Math.random() * 2,
            });
        }

        const animate = () => {
            // Use clearRect instead of fillRect to allow background to show through
            ctx.clearRect(0, 0, width, height);

            // Calculate scroll velocity
            const currentScrollY = window.scrollY;
            const velocity = Math.abs(currentScrollY - scrollY);
            scrollY = currentScrollY;

            // Determine target speed:
            // If speedRef is provided, use it (plus scroll velocity for extra kick).
            // Otherwise, use default behavior.
            const baseSpeed = speedRef ? speedRef.current : 0.5;
            const targetSpeed = baseSpeed + velocity * 0.5;

            // Smoothly interpolate speed
            internalSpeed += (targetSpeed - internalSpeed) * 0.1;

            // Get current star color
            const starColor = starColorRef ? starColorRef.current : "255, 255, 255";

            stars.forEach((star) => {
                star.z -= internalSpeed;
                if (star.z <= 0) {
                    star.z = width;
                    star.x = Math.random() * width - width / 2;
                    star.y = Math.random() * height - height / 2;
                }

                const x = (star.x / star.z) * width + width / 2;
                const y = (star.y / star.z) * height + height / 2;
                const size = (1 - star.z / width) * star.size * 2;

                if (x >= 0 && x <= width && y >= 0 && y <= height) {
                    const brightness = 1 - star.z / width;
                    ctx.fillStyle = `rgba(${starColor}, ${brightness})`;

                    if (isMobile) {
                        // Simple square for mobile - much faster
                        ctx.fillRect(x, y, size, size);
                    } else {
                        // Warp effect for desktop
                        const length = Math.max(size, size * (internalSpeed * 2));
                        ctx.beginPath();
                        const angle = Math.atan2(y - height / 2, x - width / 2);
                        const xEnd = x + Math.cos(angle) * length;
                        const yEnd = y + Math.sin(angle) * length;

                        ctx.moveTo(x, y);
                        ctx.lineTo(xEnd, yEnd);
                        ctx.strokeStyle = `rgba(${starColor}, ${brightness})`;
                        ctx.lineWidth = size;
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [speedRef, starColorRef]); // Re-run if refs change

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none"
        />
    );
};

export default Starfield;
