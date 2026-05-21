"use client";

import { useRef } from "react";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { gsap, useGSAP } from "@/lib/gsap";

const DEVICE_PATH =
  "M210 42C289 42 344 110 344 214V306C344 420 286 482 210 482C134 482 76 420 76 306V214C76 110 131 42 210 42Z";

export default function ProblemScanReveal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 74%",
          toggleActions: "play none none none",
        },
      });

      timeline
        .from(".problem-shell", {
          autoAlpha: 0,
          scale: 0.96,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(
          ".problem-caption",
          {
            autoAlpha: 0,
            y: 16,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          0.2,
        );

      if (prefersReducedMotion) {
        gsap.set([".problem-ring", ".problem-dot", ".problem-contour"], {
          autoAlpha: 1,
        });
        return;
      }

      gsap.fromTo(
        ".problem-scan-line",
        { x: -180 },
        {
          x: 180,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 78%",
            end: "bottom 24%",
            scrub: 1,
          },
        },
      );

      gsap.fromTo(
        ".problem-scan-beam",
        { opacity: 0.3 },
        {
          opacity: 0.78,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 78%",
            end: "bottom 24%",
            scrub: 1,
          },
        },
      );

      gsap.fromTo(
        ".problem-contour",
        {
          autoAlpha: 0,
          scale: 0.95,
        },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 76%",
            end: "center center",
            scrub: 1,
          },
        },
      );

      gsap.fromTo(
        ".problem-ring",
        {
          autoAlpha: 0.12,
          scale: 0.7,
        },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 74%",
            end: "center center",
            scrub: 1,
          },
        },
      );

      gsap.to(".problem-dot", {
        autoAlpha: 1,
        scale: 1.16,
        duration: 1,
        stagger: 0.08,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: rootRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden rounded-[36px] border px-6 py-8 sm:px-8"
      style={{
        borderColor: "rgba(47,143,70,0.14)",
        background:
          "linear-gradient(180deg, rgba(255,253,247,0.98) 0%, rgba(250,248,239,0.98) 100%)",
        boxShadow: "0 24px 70px rgba(23,77,42,0.08)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at center, rgba(23,77,42,0.03) 0 1px, transparent 1px 30px)",
        }}
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 420 540"
        className="problem-shell relative mx-auto w-full max-w-[440px]"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="problem-device-clip">
            <path d={DEVICE_PATH} />
          </clipPath>
          <linearGradient id="problem-outer" x1="76" y1="42" x2="344" y2="482" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8BE65A" />
            <stop offset="58%" stopColor="#5ED143" />
            <stop offset="100%" stopColor="#2F8F46" />
          </linearGradient>
          <linearGradient id="problem-inner" x1="110" y1="96" x2="310" y2="448" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="100%" stopColor="#F5F0E0" />
          </linearGradient>
          <linearGradient id="problem-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(246,183,60,0)" />
            <stop offset="50%" stopColor="rgba(246,183,60,0.55)" />
            <stop offset="100%" stopColor="rgba(246,183,60,0)" />
          </linearGradient>
          <filter id="problem-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="18" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path d={DEVICE_PATH} fill="url(#problem-outer)" />
        <path
          d="M210 76C270 76 311 131 311 215V305C311 392 266 447 210 447C154 447 109 392 109 305V215C109 131 150 76 210 76Z"
          fill="url(#problem-inner)"
        />

        <g clipPath="url(#problem-device-clip)">
          <rect
            x="40"
            y="62"
            width="340"
            height="398"
            rx="170"
            fill="rgba(255,255,255,0.12)"
          />
          <ellipse
            className="problem-contour"
            cx="210"
            cy="270"
            rx="90"
            ry="118"
            stroke="rgba(47,143,70,0.22)"
            strokeWidth="1.5"
          />
          <ellipse
            className="problem-contour"
            cx="210"
            cy="270"
            rx="66"
            ry="92"
            stroke="rgba(47,143,70,0.16)"
            strokeWidth="1.5"
          />
          <ellipse
            className="problem-contour"
            cx="210"
            cy="270"
            rx="42"
            ry="58"
            stroke="rgba(47,143,70,0.12)"
            strokeWidth="1.5"
          />

          <g filter="url(#problem-glow)">
            <circle className="problem-ring" cx="150" cy="326" r="20" fill="rgba(246,183,60,0.12)" stroke="#F6B73C" strokeWidth="2" />
            <circle className="problem-ring" cx="270" cy="260" r="18" fill="rgba(249,115,22,0.12)" stroke="#F97316" strokeWidth="2" />
            <circle className="problem-ring" cx="242" cy="378" r="16" fill="rgba(246,183,60,0.12)" stroke="#F6B73C" strokeWidth="2" />
          </g>

          <g>
            <circle className="problem-dot" cx="150" cy="326" r="4.5" fill="#F6B73C" opacity="0.48" />
            <circle className="problem-dot" cx="270" cy="260" r="4.5" fill="#F97316" opacity="0.48" />
            <circle className="problem-dot" cx="242" cy="378" r="4.5" fill="#F6B73C" opacity="0.48" />
            <circle className="problem-dot" cx="191" cy="215" r="3.8" fill="#2F8F46" opacity="0.4" />
            <circle className="problem-dot" cx="222" cy="422" r="3.8" fill="#2F8F46" opacity="0.4" />
          </g>

          <g className="problem-scan-line">
            <rect
              className="problem-scan-beam"
              x="154"
              y="88"
              width="64"
              height="360"
              rx="32"
              fill="url(#problem-beam)"
            />
            <rect
              x="182"
              y="88"
              width="8"
              height="360"
              rx="4"
              fill="rgba(246,183,60,0.92)"
            />
          </g>
        </g>

        <circle cx="184" cy="242" r="7" fill="#374A3F" opacity="0.86" />
        <circle cx="236" cy="242" r="7" fill="#374A3F" opacity="0.86" />
        <path d="M191 275C198 281 206 283 210 283C214 283 222 281 229 275" stroke="#374A3F" strokeWidth="4" strokeLinecap="round" />
        <rect x="194" y="332" width="32" height="70" rx="16" fill="#24352A" />
        <circle cx="210" cy="366" r="7" fill="#B7FF5A" />
      </svg>

      <div className="problem-caption absolute left-6 top-6 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em]" style={{ borderColor: "rgba(47,143,70,0.14)", background: "rgba(255,253,247,0.92)", color: "#2F8F46" }}>
        Scan reveal
      </div>
      <div className="problem-caption absolute bottom-6 right-6 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em]" style={{ borderColor: "rgba(246,183,60,0.18)", background: "rgba(255,253,247,0.92)", color: "#C07A11" }}>
        Hidden stress → measurable data
      </div>
    </div>
  );
}
