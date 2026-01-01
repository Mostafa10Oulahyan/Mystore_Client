/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GSAP ANIMATION CONFIGURATION
 * Premium Animation System for Awwwards-Level Experience
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Design Philosophy:
 * - Ultra-smooth, cinematic motion
 * - Apple / Stripe / Awwwards quality
 * - Motion-driven storytelling
 * - Less motion, more feeling
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ═══════════════════════════════════════════════════════════════════════════
// GSAP PLUGIN REGISTRATION
// ═══════════════════════════════════════════════════════════════════════════

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════
// EASING PRESETS - Cinematic, Premium Curves
// ═══════════════════════════════════════════════════════════════════════════

export const EASE = {
  // Primary eases - Use these 90% of the time
  smooth: "power3.out", // Default for most animations
  smoothInOut: "power3.inOut", // For symmetrical animations

  // Cinematic eases - For hero and dramatic moments
  cinematic: "expo.out", // Dramatic reveal, Apple-style
  cinematicInOut: "expo.inOut", // Perfect for page transitions

  // Luxurious eases - Slow, deliberate motion
  luxury: "power4.out", // High-end feel, slower deceleration
  luxuryIn: "power4.in", // Elegant entrance

  // Bounce & Elastic - Use sparingly for micro-interactions
  softBounce: "back.out(1.2)", // Subtle overshoot
  elastic: "elastic.out(1, 0.5)", // Playful, use for icons only

  // Quick snaps - For UI elements
  snappy: "power2.out", // Quick, responsive
  quickOut: "power1.out", // Very subtle

  // Custom cubic-bezier equivalents
  custom: {
    apple: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    stripe: "cubic-bezier(0.4, 0, 0.2, 1)",
    awwwards: "cubic-bezier(0.76, 0, 0.24, 1)",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// DURATION PRESETS - Deliberate, Cinematic Timing
// ═══════════════════════════════════════════════════════════════════════════

export const DURATION = {
  // Micro-interactions
  instant: 0.15, // Hover states, toggles
  fast: 0.25, // Quick feedback

  // Standard animations
  normal: 0.5, // Default duration
  medium: 0.7, // Moderate animations

  // Cinematic animations
  slow: 1.0, // Hero reveals
  dramatic: 1.4, // Major transitions
  epic: 2.0, // Full-page experiences

  // Staggers
  stagger: {
    fast: 0.05, // Quick succession
    normal: 0.08, // Standard stagger
    slow: 0.12, // Deliberate reveal
    dramatic: 0.2, // One by one
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL TRIGGER DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

export const SCROLL_DEFAULTS = {
  start: "top 90%", // When element enters viewport
  end: "top 20%", // When fully in view
  toggleActions: "play none none none", // Never reverse - content stays visible
  once: true, // Only animate once
  markers: false, // Set true for debugging
  scrub: false,
};

export const SCROLL_SCRUB = {
  start: "top bottom",
  end: "bottom top",
  scrub: 1, // Smooth 1-second catch-up
  markers: false,
};

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

export const ANIMATION_DEFAULTS = {
  // Fade animations
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: DURATION.normal,
    ease: EASE.smooth,
  },

  // Slide up (most common)
  slideUp: {
    from: { opacity: 0, y: 60 },
    to: { opacity: 1, y: 0 },
    duration: DURATION.medium,
    ease: EASE.smooth,
  },

  // Cinematic slide up
  cinematicSlideUp: {
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    duration: DURATION.slow,
    ease: EASE.cinematic,
  },

  // Scale reveal
  scaleReveal: {
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    duration: DURATION.medium,
    ease: EASE.smooth,
  },

  // Blur reveal (premium effect)
  blurReveal: {
    from: { opacity: 0, filter: "blur(20px)", y: 30 },
    to: { opacity: 1, filter: "blur(0px)", y: 0 },
    duration: DURATION.slow,
    ease: EASE.cinematic,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// REDUCED MOTION DETECTION
// ═══════════════════════════════════════════════════════════════════════════

export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// ═══════════════════════════════════════════════════════════════════════════
// GSAP GLOBAL DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

gsap.defaults({
  ease: EASE.smooth,
  duration: DURATION.normal,
});

// ScrollTrigger defaults
ScrollTrigger.defaults({
  toggleActions: "play none none none", // Never reverse - content stays visible
  once: true,
  markers: false,
});

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL SMOOTHER CONFIGURATION (Optional)
// ═══════════════════════════════════════════════════════════════════════════

export const SCROLL_SMOOTHER_CONFIG = {
  smooth: 1.5,
  effects: true,
  smoothTouch: 0.1,
};

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSIVE BREAKPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1536,
};

export const isMobile = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < BREAKPOINTS.tablet;
};

export const isTablet = () => {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth >= BREAKPOINTS.tablet &&
    window.innerWidth < BREAKPOINTS.laptop
  );
};

// Export GSAP and ScrollTrigger for convenience
export { gsap, ScrollTrigger };
