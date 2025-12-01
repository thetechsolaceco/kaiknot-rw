"use client";

import React, { useRef, useState } from 'react';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EmailSignup = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setLoading(true);
            setStatus({ type: null, message: '' });
            try {
                const res = await fetch('/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                const data = await res.json();

                if (res.ok) {
                    console.log('Signed up:', email);
                    setEmail('');
                    setStatus({ type: 'success', message: 'Thank you for subscribing!' });
                } else {
                    setStatus({ type: 'error', message: data.error || 'Something went wrong.' });
                }
            } catch (error) {
                console.error('Signup error:', error);
                setStatus({ type: 'error', message: 'Failed to subscribe. Please try again.' });
            } finally {
                setLoading(false);
            }
        }
    };
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
        <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center relative z-20 overflow-hidden px-4 py-20">
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

            <div ref={contentRef} className="relative z-10 max-w-4xl w-full">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-16 text-center space-y-8 shadow-2xl">
                    <h2 className="text-4xl md:text-6xl font-black font-sans text-white tracking-tighter uppercase leading-tight">
                        Be the <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">First to Know.</span>
                    </h2>
                    <p className="text-gray-400 text-base md:text-xl font-light tracking-wide max-w-2xl mx-auto">
                        Join the KaiKnot tribe for exclusive early access, first looks at our concept drops, and launch updates.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch gap-4 w-full max-w-xl mx-auto mt-8">
                        <input
                            type="email"
                            placeholder="ENTER YOUR EMAIL"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all font-light tracking-widest text-sm md:text-base text-center md:text-left"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-white text-black font-bold rounded-full px-8 py-4 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all uppercase tracking-widest text-xs md:text-sm disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap"
                        >
                            {loading ? 'Processing...' : 'Subscribe'}
                        </button>
                    </form>

                    {status.message && (
                        <p className={`text-xs tracking-widest mt-4 ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {status.message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailSignup;
