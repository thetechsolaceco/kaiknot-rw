"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { FaInstagram, FaPinterest } from "react-icons/fa";

const SocialDock = () => {
    const dockRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Fade in when scrolling past 100px
        gsap.to(dockRef.current, {
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
                trigger: "body",
                start: "100px top",
                toggleActions: "play none none reverse",
            },
        });
    }, { scope: dockRef });

    return (
        <div
            ref={dockRef}
            className="fixed right-8 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-6 opacity-0 pointer-events-auto mix-blend-difference"
        >
            {/* Instagram Official */}
            <a
                href="https://instagram.com/kaiknotwear"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-end"
            >
                <span className="absolute right-14 text-white text-[10px] font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 whitespace-nowrap bg-black/50 backdrop-blur-sm px-2 py-1 rounded border border-white/10">
                    The Brand
                </span>
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-md border border-white/10 group-hover:border-white/50 group-hover:bg-white/10 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 text-white">
                    <FaInstagram className="w-5 h-5" />
                </div>
            </a>

            {/* Instagram BTS */}
            <a
                href="https://instagram.com/kaiknotfound"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-end"
            >
                <span className="absolute right-14 text-white text-[10px] font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 whitespace-nowrap bg-black/50 backdrop-blur-sm px-2 py-1 rounded border border-white/10">
                    The Chaos
                </span>
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-md border border-white/10 group-hover:border-white/50 group-hover:bg-white/10 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 text-white">
                    <FaInstagram className="w-5 h-5 opacity-80" /> {/* Slightly different opacity to distinguish or just same icon */}
                </div>
            </a>

            {/* Pinterest */}
            <a
                href="https://pinterest.com/kaiknotwear"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-end"
            >
                <span className="absolute right-14 text-white text-[10px] font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 whitespace-nowrap bg-black/50 backdrop-blur-sm px-2 py-1 rounded border border-white/10">
                    The Mood
                </span>
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-md border border-white/10 group-hover:border-white/50 group-hover:bg-white/10 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 text-white">
                    <FaPinterest className="w-5 h-5" />
                </div>
            </a>
        </div>
    );
};

export default SocialDock;
