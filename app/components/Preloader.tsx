'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Preloader = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useGSAP(() => {
        // Pulse animation for the logo
        if (logoRef.current) {
            gsap.to(logoRef.current, {
                scale: 1.1,
                opacity: 0.8,
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
        }
    }, { scope: containerRef });

    useEffect(() => {
        const handleLoad = () => {
            // Minimum loading time of 1.5s to show the brand
            setTimeout(() => {
                if (containerRef.current) {
                    gsap.to(containerRef.current, {
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.inOut",
                        onComplete: () => setIsLoading(false)
                    });
                }
            }, 1500);
        };

        // Check if already loaded
        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
            // Fallback in case load event doesn't fire (e.g. SPA navigation)
            const timeout = setTimeout(handleLoad, 3000);
            return () => {
                window.removeEventListener('load', handleLoad);
                clearTimeout(timeout);
            };
        }
    }, []);

    if (!isLoading) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        >
            <div className="relative w-32 h-32 md:w-48 md:h-48">
                <Image
                    ref={logoRef}
                    src="/logo.png"
                    alt="Loading..."
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
};

export default Preloader;
