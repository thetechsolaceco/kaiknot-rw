"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EmailSignup = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%", // Start animation when top of section hits 80% of viewport
                toggleActions: "play none none reverse",
            },
        });

        tl.from(contentRef.current, {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center relative z-20 overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

            <div ref={contentRef} className="relative z-10 max-w-2xl w-full text-center space-y-8">
                <h2 className="text-5xl md:text-7xl font-black font-sans text-white tracking-tighter uppercase">
                    Be the <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">First to Know.</span>
                </h2>
                <p className="text-gray-400 text-lg md:text-xl font-light tracking-wide">
                    Join the KaiKnot tribe for exclusive early access, first looks at our concept drops, and launch updates.
                </p>

                <form className="flex flex-col md:flex-row gap-4 w-full max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors font-sans"
                    />
                    <button
                        type="submit"
                        className="bg-white text-black font-bold font-sans rounded-full px-8 py-4 hover:bg-gray-200 transition-colors uppercase tracking-wider"
                    >
                        Notify Me
                    </button>
                </form>


            </div>
        </div>
    );
};

export default EmailSignup;
