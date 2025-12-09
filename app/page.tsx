'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import StarWarsCrawl from './components/StarWarsCrawl';
import ProductScroll from './components/ProductScroll';
import EmailSignup from './components/EmailSignup';
import Starfield from './components/Starfield';
import CustomCursor from './components/CustomCursor';
import SocialDock from './components/SocialDock';
import ScrollIndicator from './components/ScrollIndicator';
import StoryProgress, { StoryProgressHandle } from './components/StoryProgress';

gsap.registerPlugin(ScrollTrigger);

import Preloader from "./components/Preloader";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const perspectiveRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const kainotRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null); // New Flash Ref
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const storyProgressRef = useRef<StoryProgressHandle>(null);

  // New refs for Star Wars animation
  const crawlContainerRef = useRef<HTMLDivElement>(null);
  const crawlTextRef = useRef<HTMLDivElement>(null);
  const scrollVideoRef = useRef<HTMLVideoElement>(null);
  const videoOverlayRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null); // Ref for spotlight
  const textContainerRef = useRef<HTMLDivElement>(null); // Ref for parallax text

  // Starfield speed and color control
  const starSpeedRef = useRef(0.5);
  const starColorRef = useRef("255, 255, 255"); // Start white

  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const particleCount = isMobile ? 0 : 50; // Disable particles on mobile for performance
  const particlesArray = Array.from({ length: particleCount });

  useGSAP(() => {
    const isMobileDevice = window.innerWidth < 768;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=12000', // Increased scroll length to ensure crawl finishes
        scrub: true, // Instant scrubbing to match user scroll exactly
        pin: true,
        refreshPriority: 1, // Ensure this calculates first
      },
      onUpdate: function () {
        // Timeline update logic if needed
      }
    });

    // Global Scroll Tracker for Story Progress
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        if (storyProgressRef.current) {
          storyProgressRef.current.setProgress(self.progress);
        }
      }
    });

    // --- SETUP: Sharper, Random Particles ---
    gsap.set('.particle', {
      x: () => gsap.utils.random(-100, 100),
      y: () => gsap.utils.random(-100, 100),
      z: () => gsap.utils.random(-500, 500),
      // Smaller, sharper size range
      width: () => gsap.utils.random(2, 5),
      height: () => gsap.utils.random(2, 5),
      opacity: 0,
    });

    // --- PHASE 1: The Singularity ---
    tl.to(logoRef.current, {
      scale: 0.9,
      duration: 0.5,
      ease: 'power2.in',
      force3D: true,
    })
      .to(scrollIndicatorRef.current, {
        opacity: 0,
        duration: 0.5,
      }, 0) // Fade out scroll indicator immediately
      .to(logoRef.current, {
        scale: 100, // Faster, bigger zoom
        opacity: 0,
        duration: 2.5,
        ease: 'expo.in',
        force3D: true,
      });

    // --- PHASE 2: The Brand Reveal (Hollow Text -> Filled) ---
    tl.fromTo(kainotRef.current,
      { opacity: 0, scale: 0.9, letterSpacing: '0em', color: 'transparent' },
      { opacity: 1, scale: 1, letterSpacing: '0.15em', duration: 2, ease: 'power2.out', force3D: true },
      '-=0.5' // Start slightly before logo finishes
    )
      .to(kainotRef.current, {
        color: '#ffffff', // Fill with white
        duration: 1.5,
        ease: 'power2.inOut',
        force3D: true,
      }, '-=1'); // Start filling before the scale finishes

    // --- PHASE 3: HYPERSPACE JUMP ---
    // Accelerate stars to warp speed
    tl.to(starSpeedRef, {
      current: 50, // Warp speed!
      duration: 3,
      ease: 'power4.in',
    }, '-=0.5');

    // Fade out KAINOT text during warp
    tl.to(kainotRef.current, {
      opacity: 0,
      scale: 2, // Fly towards camera
      duration: 1.5,
      ease: 'power2.in',
      force3D: true,
    }, '<+=1');

    // --- PHASE 4: THE FLASH & ARRIVAL ---
    // White flash
    tl.to(flashRef.current, {
      opacity: 1,
      duration: 0.1,
      ease: 'power4.out',
    })
      .to(flashRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      });

    // Reset star speed instantly after flash
    tl.set(starSpeedRef, { current: 0.5 });


    // --- PHASE 5: Content & Sharp Particle Big Bang ---
    tl.fromTo(contentRef.current,
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 2, ease: 'power3.out', force3D: true },
      '-=0.4' // Slam in right after flash
    );

    // Fade out video overlay AFTER content reveals
    if (videoOverlayRef.current) {
      tl.to(videoOverlayRef.current, {
        opacity: 0,
        duration: 2,
        ease: 'power2.inOut',
      }, '<+=1'); // Start fading shortly after content appears
    }

    // Only animate particles if not on mobile
    if (!isMobileDevice && particleCount > 0) {
      tl.to('.particle', {
        x: () => gsap.utils.random(-800, 800),
        y: () => gsap.utils.random(-500, 500),
        z: () => gsap.utils.random(500, 1500), // Fly further out
        opacity: () => gsap.utils.random(0.5, 1), // Higher opacity, less fade
        duration: 4,
        ease: 'expo.out',
        force3D: true,
      }, '-=2');
    }

    // --- PHASE 6: Star Wars Scroll & Color Inversion ---
    // Fade out "Coming Soon" content
    tl.to(contentRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 2,
      ease: 'power2.in',
      force3D: true,
    }, '+=1'); // Hold for a moment

    // Fade in Star Wars container
    tl.to(crawlContainerRef.current, {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
    });

    // Fade out scroll video
    if (scrollVideoRef.current) {
      tl.to(scrollVideoRef.current, {
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      }, '<');
    }

    // --- COLOR INVERSION START ---
    // Animate background to white
    tl.to(containerRef.current, {
      backgroundColor: '#ffffff',
      duration: 2,
      ease: 'power2.inOut',
    }, '<');

    // Animate stars to black (using a proxy object approach or direct ref tween if supported,
    // but for string refs we need a custom tween or just snap it.
    // A cleaner way for canvas is to tween a proxy object and update the ref in onUpdate)
    const colorProxy = { r: 255, g: 255, b: 255 };
    tl.to(colorProxy, {
      r: 0, g: 0, b: 0,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        starColorRef.current = `${Math.round(colorProxy.r)}, ${Math.round(colorProxy.g)}, ${Math.round(colorProxy.b)}`;
      }
    }, '<');

    // Animate crawl text to black
    tl.to(crawlContainerRef.current, {
      '--crawl-color': '#000000',
      duration: 2,
      ease: 'power2.inOut',
    }, '<');
    // --- COLOR INVERSION END ---

    // Animate the crawl text
    tl.fromTo(crawlTextRef.current,
      {
        top: '100%', // Start below screen
        rotateX: 25, // Match CSS rotation
        z: 0
      },
      {
        top: '-250%', // Scroll far up
        rotateX: 25, // Maintain rotation
        z: -1500, // Move away from camera
        duration: 25, // Slower scroll
        ease: 'none',
        force3D: true,
      }, '<');

    // --- PHASE 7: FADE BACK TO BLACK ---
    // Fade background back to black before product scroll
    tl.to(containerRef.current, {
      backgroundColor: '#000000',
      duration: 2,
      ease: 'power2.inOut',
    }, '-=3'); // Start fading back before crawl fully finishes

    // Fade stars back to white
    tl.to(colorProxy, {
      r: 255, g: 255, b: 255,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        starColorRef.current = `${Math.round(colorProxy.r)}, ${Math.round(colorProxy.g)}, ${Math.round(colorProxy.b)}`;
      }
    }, '<');

    // --- SCROLL VIDEO SCRUBBING (Moved to end to capture full duration) ---
    if (scrollVideoRef.current) {
      const video = scrollVideoRef.current;

      // Force pause immediately
      video.pause();
      video.currentTime = 0;

      const videoDuration = 10; // Fallback

      // Add tween covering the entire timeline duration
      tl.to(video, {
        currentTime: video.duration || videoDuration,
        ease: "none",
        duration: tl.duration(),
        onStart: () => video.pause(),
      }, 0);
    }

    // Mouse move effect for parallax and spotlight - DESKTOP ONLY
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return; // Disable on mobile

      if (!containerRef.current || !textContainerRef.current || !spotlightRef.current || !perspectiveRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Spotlight follows cursor
      gsap.to(spotlightRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.1, // Fast follow
        ease: "power2.out",
        force3D: true,
      });

      // 3D Parallax for Text
      const xPos = (clientX / innerWidth - 0.5) * 20; // -10 to 10 deg
      const yPos = (clientY / innerHeight - 0.5) * 20;

      gsap.to(perspectiveRef.current, {
        rotationY: xPos,
        rotationX: -yPos,
        duration: 1,
        ease: "power3.out",
        force3D: true,
      });
    };

    // Only add mouse listener on desktop
    if (!isMobileDevice) {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }

  }, { scope: containerRef });

  return (
    <>
      <CustomCursor />
      <StoryProgress ref={storyProgressRef} count={7} />
      <SocialDock />
      <main className="bg-black min-h-screen w-full overflow-x-hidden relative selection:bg-white/20">
        <Preloader />
        {/* Grain Overlay */}
        <div
          ref={containerRef}
          className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden perspective-container"
        >
          {/* Keeps the grain, but it's subtle over pure black. Adds texture without color. */}
          {/* Keeps the grain, but it's subtle over pure black. Adds texture without color. Hidden on mobile for performance. */}
          <div className="absolute inset-0 z-[60] pointer-events-none opacity-[0.08] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay hidden md:block"></div>

          {/* Scroll Driven Video with Overlay */}
          <div className="absolute inset-0 z-0">
            <video
              ref={scrollVideoRef}
              src="/video2.mp4"
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover opacity-60" // Reduced opacity to blend
            />
            <div ref={videoOverlayRef} className="absolute inset-0 bg-black/60"></div> {/* Dark overlay */}
          </div>

          <Starfield speedRef={starSpeedRef} starColorRef={starColorRef} /> {/* Starfield Background with speed and color control */}

          {/* --- LAYER 1: CONTENT --- */}
          <div ref={contentRef} className="relative z-10 flex flex-col items-center justify-center text-center perspective-1000">
            {/* Spotlight Effect */}
            <div
              ref={spotlightRef}
              className="absolute w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-overlay z-0"
            />

            <div className="relative z-10" ref={textContainerRef}>
              <div className="flex flex-col items-center justify-center w-full">
                {/* TITLE: COMING SOON */}
                <h1 className="text-8xl md:text-[160px] font-black font-display text-white tracking-tighter leading-[1.1] mix-blend-difference z-20 flex flex-col items-center">
                  <span>COMING</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-600">SOON</span>
                </h1>

                {/* SUB TITLE: The World Changes... */}
                <div className="relative z-30 mt-8 md:mt-12">
                  <p className="text-white/80 text-xs md:text-xl font-semibold tracking-[0.5em] uppercase text-center max-w-5xl mx-auto px-4">
                    The world changes when you stop trying to fit in. KaiKnot is Knotted by Individuality
                  </p>
                </div>

                {/* PARAGRAPH: KaiKnot is... */}
                {/* <div className="mt-8 md:mt-12">
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 text-sm md:text-2xl font-medium tracking-[0.3em] uppercase text-center">

                  </p>
                </div> */}
              </div>
              {/* BLUE GLOW REMOVED HERE */}
            </div>

            {/* Particles Container - No Glows */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 preserve-3d">
              {particlesArray.map((_, i) => (
                <div
                  key={i}
                  // Removed shadow-lg class. Just flat white circles.
                  className="particle absolute rounded-full bg-white"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: '0px',
                    height: '0px'
                  }}
                />
              ))}
            </div>
          </div>

          {/* LIGHT REF LAYER REMOVED HERE */}

          {/* --- LAYER 3: FLASH OVERLAY --- */}
          <div
            ref={flashRef}
            className="absolute inset-0 z-[70] bg-white pointer-events-none opacity-0"
          />

          {/* --- LAYER 4: KAINOT TEXT (Hollow B&W) --- */}
          <h1
            ref={kainotRef}
            className="absolute z-40 text-7xl md:text-[12rem] font-black font-display tracking-widest text-center opacity-0 pointer-events-none"
            style={{
              color: 'transparent',
              // Thinner, sharper stroke
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.9)',
            }}
          >
            KAINOT
          </h1>

          {/* --- LAYER 5: LOGO (Clean B&W) --- */}
          <div className="absolute z-50 flex items-center justify-center pointer-events-none mix-blend-exclusion">
            <Image
              ref={logoRef}
              src="/logo.png"
              alt="Kainot Logo"
              width={300}
              height={300}
              // Removed drop-shadow
              className="w-32 h-32 md:w-64 md:h-64 object-contain"
            />
          </div>

          {/* Scroll Indicator - Fades out on scroll */}
          <div ref={scrollIndicatorRef} className="absolute bottom-10 left-0 w-full z-50 pointer-events-none mix-blend-difference">
            <ScrollIndicator />
          </div>

          <StarWarsCrawl ref={crawlTextRef} containerRef={crawlContainerRef} />
        </div>
      </main>
      <ProductScroll />
      <footer className="w-full h-screen bg-black text-white flex flex-col items-center justify-center z-50 relative overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black/70 z-10"></div>

        {/* Content */}
        <EmailSignup />
      </footer>
    </>
  );
}