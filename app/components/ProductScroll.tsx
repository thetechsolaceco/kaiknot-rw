"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const products = [
    {
        id: 1,
        title: "Ethereal Gaze",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1887&auto=format&fit=crop",
        description: "Capturing the soul of modern aesthetics.",
    },
    {
        id: 2,
        title: "Urban Avant",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1888&auto=format&fit=crop",
        description: "Streetwear redefined for the bold.",
    },
    {
        id: 3,
        title: "Velvet Noir",
        image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1887&auto=format&fit=crop",
        description: "Elegance in the shadows.",
    },
    {
        id: 4,
        title: "Editorial Drift",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        description: "High fashion meets raw emotion.",
    },
    {
        id: 5,
        title: "Chromatic Pulse",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1895&auto=format&fit=crop",
        description: "Vibrant styles for a vibrant life.",
    },
    {
        id: 6,
        title: "Silk & Stone",
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop",
        description: "Soft textures, hard edges.",
    },
];

const ProductScroll = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const totalWidth = sectionRef.current?.scrollWidth || 0;
        const viewportWidth = window.innerWidth;
        const scrollDistance = -(totalWidth - viewportWidth + 100); // Scroll full width + buffer
        const isMobile = window.innerWidth < 768;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerRef.current,
                start: "top top",
                end: "+=3000",
                scrub: isMobile ? 2 : 1, // Less frequent updates on mobile
                pin: true,
            },
        });

        tl.to(sectionRef.current, {
            x: scrollDistance,
            ease: "none",
            force3D: true, // Hardware acceleration
        });

        // Parallax Effect - Disable on mobile for performance
        if (!isMobile) {
            const images = sectionRef.current?.querySelectorAll(".product-image");
            if (images) {
                images.forEach((img) => {
                    gsap.fromTo(img,
                        { x: -30 }, // Reduced range to prevent gaps
                        {
                            x: 30,
                            ease: "none",
                            force3D: true,
                            scrollTrigger: {
                                trigger: triggerRef.current,
                                start: "top top",
                                end: "+=3000",
                                scrub: 1,
                            },
                        }
                    );
                });
            }
        }
    }, { scope: triggerRef });

    return (
        <section ref={triggerRef} className="overflow-hidden h-screen w-full bg-black relative z-30 flex items-center">
            <div
                ref={sectionRef}
                className="flex gap-5 px-[50vw]" // Start from center-ish and have 20px gaps
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="relative flex-shrink-0 w-[300px] md:w-[400px] h-[60vh] md:h-[70vh] rounded-xl overflow-hidden group grayscale hover:grayscale-0 transition-all duration-500 border border-white/10"
                    >
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-20 pointer-events-none" />

                        <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="product-image object-cover scale-[1.35] transition-transform duration-700 group-hover:scale-[1.45]" // Increased base scale and hover scale
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <h2 className="text-2xl md:text-4xl font-black font-display text-white mb-2 tracking-tighter uppercase translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-100 ease-out">
                                {product.title}
                            </h2>
                            <p className="text-gray-300 text-sm md:text-base font-sans font-light tracking-wide translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-200 ease-out">
                                {product.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProductScroll;
