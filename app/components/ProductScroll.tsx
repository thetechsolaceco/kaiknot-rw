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
        image: "/products/product1.png",
    },
    {
        id: 2,
        image: "/products/product2.png",
    },
    {
        id: 3,
        image: "/products/product3.png",
    },
    {
        id: 4,
        image: "/products/product4.png",
    },
    {
        id: 5,
        image: "/products/product5.png",
    },
    {
        id: 6,
        image: "/products/product6.png",
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
                            alt={`Product ${product.id}`}
                            fill
                            className="product-image object-cover scale-[1.35] transition-transform duration-700 group-hover:scale-[1.45]" // Increased base scale and hover scale
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProductScroll;
