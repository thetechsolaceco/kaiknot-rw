'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { FaChevronDown } from 'react-icons/fa6';

const ScrollIndicator = () => {
    const arrowRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Continuous bounce animation
        gsap.to(arrowRef.current, {
            y: 10,
            duration: 1.5,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
        });

        // Optional: Fade out on scroll (handled by parent or global scroll trigger if needed, 
        // but for now simpler to just let it sit there or be covered)
        // If we want it to fade out, we can use ScrollTrigger here too.
        // Let's keep it simple: it just animates.
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center justify-center gap-2 pointer-events-none mix-blend-difference">
            <span className="text-white/50 text-[10px] tracking-[0.2em] font-light uppercase">Scroll</span>
            <div ref={arrowRef} className="text-white">
                <FaChevronDown className="w-6 h-6 animate-pulse" />
            </div>
        </div>
    );
};

export default ScrollIndicator;
