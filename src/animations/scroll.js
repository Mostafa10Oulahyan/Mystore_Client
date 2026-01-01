/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCROLL-BASED ANIMATIONS
 * ScrollTrigger-Powered Cinematic Scroll Experiences
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  gsap,
  ScrollTrigger,
  EASE,
  DURATION,
  prefersReducedMotion,
  SCROLL_DEFAULTS,
} from "./config";

// ═══════════════════════════════════════════════════════════════════════════
// SECTION REVEAL ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates direction-aware section reveal
 * Section animates from the direction it's being scrolled from
 *
 * @param {HTMLElement} section - Section to animate
 * @param {Object} options - Animation options
 */
export const createSectionReveal = (section, options = {}) => {
  const {
    y = 60,
    duration = DURATION.medium,
    ease = EASE.smooth,
    start = "top 85%",
    delay = 0,
  } = options;

  if (prefersReducedMotion()) {
    gsap.set(section, { opacity: 1 });
    return null;
  }

  return gsap.fromTo(
    section,
    {
      opacity: 0,
      y,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger: section,
        start,
        toggleActions: "play none none none",
        once: true,
      },
    }
  );
};

/**
 * Creates cinematic blur-fade reveal
 * Premium effect with blur + fade + slide
 *
 * @param {HTMLElement} element - Element to reveal
 * @param {Object} options - Animation options
 */
export const createBlurReveal = (element, options = {}) => {
  const {
    duration = DURATION.slow,
    y = 40,
    blur = 15,
    delay = 0,
    start = "top 85%",
  } = options;

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1 });
    return null;
  }

  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y,
      filter: `blur(${blur}px)`,
    },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration,
      delay,
      ease: EASE.cinematic,
      scrollTrigger: {
        trigger: element,
        start,
        toggleActions: "play none none none",
        once: true,
      },
    }
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STAGGERED CARD ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates staggered card reveal with depth effect
 * Cards appear with slight rotation and scale for 3D feel
 *
 * @param {HTMLElement} container - Container with card children
 * @param {Object} options - Animation options
 */
export const createCardStagger = (container, options = {}) => {
  const {
    stagger = DURATION.stagger.normal,
    duration = DURATION.medium,
    y = 50,
    rotateX = 10,
    scale = 0.95,
    start = "top 85%",
  } = options;

  if (prefersReducedMotion()) {
    gsap.set(container.children, { opacity: 1 });
    return null;
  }

  const cards = container.children;

  return gsap.fromTo(
    cards,
    {
      opacity: 0,
      y,
      rotateX,
      scale,
      transformPerspective: 1000,
      transformOrigin: "center bottom",
    },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      duration,
      stagger,
      ease: EASE.smooth,
      scrollTrigger: {
        trigger: container,
        start,
        toggleActions: "play none none none",
        once: true,
      },
    }
  );
};

/**
 * Creates waterfall stagger effect
 * Items reveal in a diagonal pattern for dynamic feel
 *
 * @param {HTMLElement} grid - Grid container
 * @param {number} columns - Number of columns in grid
 * @param {Object} options - Animation options
 */
export const createWaterfallStagger = (grid, columns = 4, options = {}) => {
  const {
    duration = DURATION.normal,
    staggerBase = 0.05,
    start = "top 85%",
  } = options;

  if (prefersReducedMotion()) {
    gsap.set(grid.children, { opacity: 1 });
    return null;
  }

  const items = Array.from(grid.children);

  return gsap.fromTo(
    items,
    {
      opacity: 0,
      y: 40,
      scale: 0.95,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      ease: EASE.smooth,
      stagger: {
        each: staggerBase,
        grid: [Math.ceil(items.length / columns), columns],
        from: "start",
      },
      scrollTrigger: {
        trigger: grid,
        start,
        toggleActions: "play none none none",
        once: true,
      },
    }
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PARALLAX EFFECTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates smooth parallax effect for images
 * Slow, elegant movement on scroll
 *
 * @param {HTMLElement} image - Image element
 * @param {Object} options - Animation options
 */
export const createParallax = (image, options = {}) => {
  const {
    speed = 0.3, // How much to move (0-1)
    direction = "y", // y or x
    scrub = 1.5,
  } = options;

  if (prefersReducedMotion()) return null;

  const movement =
    direction === "y" ? { yPercent: speed * 100 } : { xPercent: speed * 100 };

  return gsap.to(image, {
    ...movement,
    ease: "none",
    scrollTrigger: {
      trigger: image.parentElement || image,
      start: "top bottom",
      end: "bottom top",
      scrub,
    },
  });
};

/**
 * Creates layered parallax for multi-layer depth
 *
 * @param {Array<HTMLElement>} layers - Array of layer elements (back to front)
 * @param {Object} options - Animation options
 */
export const createLayeredParallax = (layers, options = {}) => {
  const { baseSpeed = 0.1, scrub = 1.5 } = options;

  if (prefersReducedMotion()) return null;

  const animations = [];

  layers.forEach((layer, index) => {
    // Back layers move slower, front layers faster
    const speed = baseSpeed * (index + 1);

    const anim = gsap.to(layer, {
      yPercent: speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: layer.parentElement || layer,
        start: "top bottom",
        end: "bottom top",
        scrub,
      },
    });

    animations.push(anim);
  });

  return animations;
};

// ═══════════════════════════════════════════════════════════════════════════
// PIN ANIMATIONS (STORYTELLING)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates a pinned storytelling section
 * Section stays fixed while content animates
 *
 * @param {HTMLElement} section - Section to pin
 * @param {HTMLElement} content - Content to animate within
 * @param {Object} options - Animation options
 */
export const createPinnedSection = (section, content, options = {}) => {
  const {
    duration = "100%", // How long to pin (in scroll distance)
    scrub = 1,
  } = options;

  if (prefersReducedMotion()) return null;

  return gsap.to(content, {
    y: 0,
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: `+=${duration}`,
      pin: true,
      scrub,
      anticipatePin: 1,
    },
  });
};

/**
 * Creates horizontal scroll section
 * Content scrolls horizontally while user scrolls vertically
 *
 * @param {HTMLElement} section - Container section
 * @param {HTMLElement} track - Horizontal track element
 * @param {Object} options - Animation options
 */
export const createHorizontalScroll = (section, track, options = {}) => {
  const { scrub = 1 } = options;

  if (prefersReducedMotion()) return null;

  const distance = track.scrollWidth - window.innerWidth;

  return gsap.to(track, {
    x: -distance,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: `+=${distance}`,
      pin: true,
      scrub,
      anticipatePin: 1,
    },
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// SCRUB ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates scrub-based scale animation
 * Element scales as user scrolls through
 *
 * @param {HTMLElement} element - Element to animate
 * @param {Object} options - Animation options
 */
export const createScrubScale = (element, options = {}) => {
  const {
    fromScale = 0.8,
    toScale = 1,
    scrub = 1,
    start = "top 80%",
    end = "top 20%",
  } = options;

  if (prefersReducedMotion()) return null;

  return gsap.fromTo(
    element,
    { scale: fromScale, opacity: 0.5 },
    {
      scale: toScale,
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start,
        end,
        scrub,
      },
    }
  );
};

/**
 * Creates scrub-based text reveal
 * Text opacity/position changes as scrolling
 *
 * @param {HTMLElement} text - Text element
 * @param {Object} options - Animation options
 */
export const createScrubTextReveal = (text, options = {}) => {
  const { scrub = 1, start = "top 90%", end = "top 30%" } = options;

  if (prefersReducedMotion()) return null;

  return gsap.fromTo(
    text,
    {
      opacity: 0,
      y: 50,
      filter: "blur(10px)",
    },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      ease: "none",
      scrollTrigger: {
        trigger: text,
        start,
        end,
        scrub,
      },
    }
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS INDICATORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates scroll progress indicator
 *
 * @param {HTMLElement} progressBar - Progress bar element
 */
export const createScrollProgress = (progressBar) => {
  return gsap.to(progressBar, {
    scaleX: 1,
    transformOrigin: "left center",
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
    },
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Batch create scroll animations for multiple elements
 * More efficient than individual ScrollTriggers
 *
 * @param {string} selector - CSS selector for elements
 * @param {Object} options - Animation options
 */
export const createBatchAnimation = (selector, options = {}) => {
  const {
    y = 50,
    duration = DURATION.normal,
    stagger = DURATION.stagger.fast,
    start = "top 85%",
    batchMax = 5, // Max items to animate at once
  } = options;

  if (prefersReducedMotion()) {
    gsap.set(selector, { opacity: 1 });
    return null;
  }

  ScrollTrigger.batch(selector, {
    start,
    onEnter: (elements) => {
      gsap.fromTo(
        elements,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: EASE.smooth,
          overwrite: true,
        }
      );
    },
    onLeaveBack: (elements) => {
      gsap.to(elements, {
        opacity: 0,
        y,
        duration: duration * 0.5,
        stagger: stagger * 0.5,
        ease: EASE.smooth,
        overwrite: true,
      });
    },
    batchMax,
  });
};

/**
 * Refresh all ScrollTriggers
 * Call after dynamic content loads
 */
export const refreshScrollTriggers = () => {
  ScrollTrigger.refresh();
};

/**
 * Kill all ScrollTriggers
 * Call on unmount for cleanup
 */
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};
