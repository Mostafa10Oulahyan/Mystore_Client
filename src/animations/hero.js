/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HERO SECTION ANIMATIONS
 * Cinematic, WOW-Effect Entrance Animations
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { gsap, EASE, DURATION, prefersReducedMotion } from "./config";

/**
 * Creates a cinematic hero entrance timeline
 * Apple/Stripe-style reveal with masked text, staggered elements, and depth
 *
 * @param {Object} refs - Object containing element refs
 * @param {HTMLElement} refs.container - Main hero container
 * @param {HTMLElement} refs.title - Hero title element
 * @param {HTMLElement} refs.subtitle - Subtitle/tagline element
 * @param {HTMLElement} refs.description - Description paragraph
 * @param {HTMLElement} refs.cta - Call-to-action button
 * @param {HTMLElement} refs.image - Hero image element
 * @param {HTMLElement} refs.badges - Floating badges container
 * @returns {gsap.core.Timeline}
 */
export const createHeroTimeline = (refs) => {
  const tl = gsap.timeline({
    defaults: {
      ease: EASE.cinematic,
    },
    onComplete: () => {
      // Start infinite micro-animations after main entrance
      if (refs.cta) startCTAFloat(refs.cta);
      if (refs.badges) startBadgesFloat(refs.badges);
    },
  });

  // Respect reduced motion preference
  if (prefersReducedMotion()) {
    tl.set(
      [refs.title, refs.subtitle, refs.description, refs.cta, refs.image],
      {
        opacity: 1,
      }
    );
    return tl;
  }

  // Initial state - everything hidden
  tl.set(refs.container, { visibility: "visible" });

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 1: Title Cinematic Reveal (0s - 1.2s)
  // ─────────────────────────────────────────────────────────────────────────
  if (refs.title) {
    tl.fromTo(
      refs.title,
      {
        opacity: 0,
        y: 80,
        clipPath: "inset(100% 0% 0% 0%)",
      },
      {
        opacity: 1,
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: DURATION.slow,
        ease: EASE.cinematic,
      },
      0
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 2: Subtitle & Description (0.3s - 1.0s)
  // ─────────────────────────────────────────────────────────────────────────
  if (refs.subtitle) {
    tl.fromTo(
      refs.subtitle,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: DURATION.medium,
        ease: EASE.smooth,
      },
      0.3
    );
  }

  if (refs.description) {
    tl.fromTo(
      refs.description,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: DURATION.medium,
        ease: EASE.smooth,
      },
      0.5
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 3: CTA Button Reveal (0.7s - 1.2s)
  // ─────────────────────────────────────────────────────────────────────────
  if (refs.cta) {
    tl.fromTo(
      refs.cta,
      {
        opacity: 0,
        y: 20,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: DURATION.normal,
        ease: EASE.softBounce,
      },
      0.7
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 4: Image Depth Animation (0.2s - 1.4s)
  // ─────────────────────────────────────────────────────────────────────────
  if (refs.image) {
    tl.fromTo(
      refs.image,
      {
        opacity: 0,
        scale: 1.1,
        filter: "blur(20px)",
      },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: DURATION.dramatic,
        ease: EASE.cinematic,
      },
      0.2
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 5: Floating Badges Stagger (0.8s - 1.5s)
  // ─────────────────────────────────────────────────────────────────────────
  if (refs.badges) {
    const badges = refs.badges.children || refs.badges;
    tl.fromTo(
      badges,
      {
        opacity: 0,
        x: 50,
        scale: 0.9,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: DURATION.medium,
        stagger: DURATION.stagger.slow,
        ease: EASE.softBounce,
      },
      0.8
    );
  }

  return tl;
};

/**
 * Creates infinite floating animation for CTA button
 * Subtle yoyo motion that feels alive
 */
export const startCTAFloat = (element) => {
  if (prefersReducedMotion()) return null;

  return gsap.to(element, {
    y: -5,
    duration: 2,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
};

/**
 * Creates staggered floating animation for badges
 * Each badge floats at different timing for organic feel
 */
export const startBadgesFloat = (container) => {
  if (prefersReducedMotion()) return null;

  const badges = container.children || [container];
  const timelines = [];

  Array.from(badges).forEach((badge, i) => {
    const tl = gsap.to(badge, {
      y: gsap.utils.random(-8, -4),
      duration: gsap.utils.random(2, 3),
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: i * 0.3,
    });
    timelines.push(tl);
  });

  return timelines;
};

/**
 * Creates masked text reveal animation
 * Premium clip-path animation for headlines
 *
 * @param {HTMLElement|NodeList} lines - Text lines to animate
 * @param {Object} options - Animation options
 */
export const createTextReveal = (lines, options = {}) => {
  const {
    stagger = DURATION.stagger.slow,
    duration = DURATION.slow,
    delay = 0,
    ease = EASE.cinematic,
    direction = "up", // up, down, left, right
  } = options;

  const clipPaths = {
    up: {
      from: "inset(100% 0% 0% 0%)",
      to: "inset(0% 0% 0% 0%)",
    },
    down: {
      from: "inset(0% 0% 100% 0%)",
      to: "inset(0% 0% 0% 0%)",
    },
    left: {
      from: "inset(0% 100% 0% 0%)",
      to: "inset(0% 0% 0% 0%)",
    },
    right: {
      from: "inset(0% 0% 0% 100%)",
      to: "inset(0% 0% 0% 0%)",
    },
  };

  const clip = clipPaths[direction];

  return gsap.fromTo(
    lines,
    {
      clipPath: clip.from,
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
      x: direction === "left" ? -50 : direction === "right" ? 50 : 0,
    },
    {
      clipPath: clip.to,
      y: 0,
      x: 0,
      duration,
      stagger,
      delay,
      ease,
    }
  );
};

/**
 * Creates split text animation for characters
 * Each character animates individually for dramatic effect
 *
 * @param {HTMLElement} element - Container with text
 * @param {Object} options - Animation options
 */
export const createCharacterReveal = (element, options = {}) => {
  const {
    duration = DURATION.normal,
    stagger = 0.03,
    delay = 0,
    ease = EASE.cinematic,
  } = options;

  // Get text and split into characters
  const text = element.textContent;
  element.innerHTML = "";

  text.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.display = "inline-block";
    span.style.opacity = "0";
    span.style.transform = "translateY(50px) rotateX(-90deg)";
    element.appendChild(span);
  });

  return gsap.to(element.children, {
    opacity: 1,
    y: 0,
    rotateX: 0,
    duration,
    stagger,
    delay,
    ease,
  });
};

/**
 * Creates background gradient animation
 * Subtle, cinematic color shifting
 *
 * @param {HTMLElement} element - Element with gradient background
 */
export const createGradientAnimation = (element) => {
  if (prefersReducedMotion()) return null;

  // Store original gradient for reference (element must have background-size: 200%)
  void window.getComputedStyle(element);

  return gsap.to(element, {
    backgroundPosition: "100% 100%",
    duration: 10,
    ease: "none",
    repeat: -1,
    yoyo: true,
  });
};

/**
 * Creates parallax effect for hero image
 * Slow, smooth movement on scroll
 *
 * @param {HTMLElement} image - Image element
 * @param {HTMLElement} container - Container element for trigger
 */
export const createHeroParallax = (image, container) => {
  if (prefersReducedMotion()) return null;

  return gsap.to(image, {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
      trigger: container,
      start: "top top",
      end: "bottom top",
      scrub: 1.5,
    },
  });
};

/**
 * Creates cinematic image reveal with mask
 * Premium wipe/reveal effect
 *
 * @param {HTMLElement} image - Image to reveal
 * @param {Object} options - Animation options
 */
export const createImageReveal = (image, options = {}) => {
  const {
    direction = "bottom", // top, bottom, left, right
    duration = DURATION.dramatic,
    delay = 0,
    ease = EASE.cinematic,
  } = options;

  const clipPaths = {
    top: {
      from: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    bottom: {
      from: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    left: {
      from: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    right: {
      from: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
  };

  const clip = clipPaths[direction];

  return gsap.fromTo(
    image,
    {
      clipPath: clip.from,
      scale: 1.2,
    },
    {
      clipPath: clip.to,
      scale: 1,
      duration,
      delay,
      ease,
    }
  );
};
