/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PAGE TRANSITIONS
 * Cinematic Route Enter/Exit Animations for React Router
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { gsap, EASE, DURATION, prefersReducedMotion } from "./config";

// ═══════════════════════════════════════════════════════════════════════════
// TRANSITION OVERLAY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates a reusable page transition overlay element
 * Append this to your app root on mount
 */
export const createTransitionOverlay = () => {
  const overlay = document.createElement("div");
  overlay.id = "page-transition-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #0067FF;
    z-index: 9999;
    transform: translateY(100%);
    pointer-events: none;
  `;
  document.body.appendChild(overlay);
  return overlay;
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE EXIT ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates page exit animation
 * Current page fades/slides out before navigation
 *
 * @param {HTMLElement} page - Page container element
 * @param {string} direction - Animation direction (up, down, left, right, fade)
 */
export const createPageExit = (page, direction = "up") => {
  if (prefersReducedMotion()) {
    return gsap.set(page, { opacity: 0 });
  }

  const animations = {
    up: { y: -50, opacity: 0 },
    down: { y: 50, opacity: 0 },
    left: { x: -50, opacity: 0 },
    right: { x: 50, opacity: 0 },
    fade: { opacity: 0 },
    scale: { scale: 0.95, opacity: 0 },
  };

  const target = animations[direction] || animations.up;

  return gsap.to(page, {
    ...target,
    duration: DURATION.normal,
    ease: EASE.smooth,
  });
};

/**
 * Creates cinematic page exit with overlay
 * Overlay slides up, covering the page
 *
 * @param {HTMLElement} overlay - Transition overlay element
 */
export const createOverlayExit = (overlay) => {
  if (prefersReducedMotion()) {
    return gsap.timeline();
  }

  const tl = gsap.timeline();

  tl.fromTo(
    overlay,
    {
      y: "100%",
    },
    {
      y: "0%",
      duration: DURATION.medium,
      ease: EASE.cinematic,
    }
  );

  return tl;
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE ENTER ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates page enter animation
 * New page animates in after navigation
 *
 * @param {HTMLElement} page - Page container element
 * @param {string} direction - Animation direction (up, down, left, right, fade)
 */
export const createPageEnter = (page, direction = "up") => {
  if (prefersReducedMotion()) {
    return gsap.set(page, { opacity: 1 });
  }

  const startPositions = {
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
    left: { x: 50, opacity: 0 },
    right: { x: -50, opacity: 0 },
    fade: { opacity: 0 },
    scale: { scale: 1.05, opacity: 0 },
  };

  const start = startPositions[direction] || startPositions.up;

  return gsap.fromTo(page, start, {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    duration: DURATION.medium,
    ease: EASE.smooth,
  });
};

/**
 * Creates cinematic page enter with overlay
 * Overlay slides away to reveal new page
 *
 * @param {HTMLElement} overlay - Transition overlay element
 */
export const createOverlayEnter = (overlay) => {
  if (prefersReducedMotion()) {
    return gsap.set(overlay, { y: "-100%" });
  }

  const tl = gsap.timeline();

  tl.to(overlay, {
    y: "-100%",
    duration: DURATION.medium,
    ease: EASE.cinematic,
  });

  return tl;
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPLETE PAGE TRANSITION TIMELINES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates full page transition timeline
 * Exit -> Navigation -> Enter
 *
 * @param {Object} refs - Object containing element refs
 * @param {string} transitionType - Type of transition
 * @param {Function} onNavigate - Callback to execute navigation
 */
export const createFullTransition = (
  refs,
  transitionType = "slide",
  onNavigate
) => {
  const { currentPage, overlay } = refs;
  const tl = gsap.timeline();

  if (prefersReducedMotion()) {
    tl.add(() => onNavigate?.());
    return tl;
  }

  switch (transitionType) {
    case "slide":
      tl
        // Exit current page
        .to(currentPage, {
          y: -30,
          opacity: 0,
          duration: DURATION.fast,
          ease: EASE.smooth,
        })
        // Execute navigation
        .add(() => onNavigate?.())
        // Small pause
        .to({}, { duration: 0.05 });
      break;

    case "overlay":
      tl
        // Slide overlay up
        .to(overlay, {
          y: "0%",
          duration: DURATION.medium,
          ease: EASE.cinematic,
        })
        // Execute navigation during overlay
        .add(() => onNavigate?.(), "-=0.1")
        // Small pause at center
        .to({}, { duration: 0.15 })
        // Slide overlay out
        .to(overlay, {
          y: "-100%",
          duration: DURATION.medium,
          ease: EASE.cinematic,
        });
      break;

    case "fade":
      tl.to(currentPage, {
        opacity: 0,
        duration: DURATION.fast,
        ease: EASE.smooth,
      }).add(() => onNavigate?.());
      break;

    case "scale":
      tl.to(currentPage, {
        scale: 0.95,
        opacity: 0,
        duration: DURATION.fast,
        ease: EASE.smooth,
      }).add(() => onNavigate?.());
      break;

    default:
      tl.add(() => onNavigate?.());
  }

  return tl;
};

/**
 * Creates split screen transition
 * Two panels slide apart to reveal new page
 *
 * @param {HTMLElement} leftPanel - Left panel element
 * @param {HTMLElement} rightPanel - Right panel element
 * @param {Function} onMiddle - Callback when panels are split
 */
export const createSplitTransition = (leftPanel, rightPanel, onMiddle) => {
  const tl = gsap.timeline();

  if (prefersReducedMotion()) {
    tl.add(() => onMiddle?.());
    return tl;
  }

  tl
    // Panels slide in from sides
    .fromTo(
      leftPanel,
      { x: "-100%" },
      { x: "0%", duration: DURATION.medium, ease: EASE.cinematic }
    )
    .fromTo(
      rightPanel,
      { x: "100%" },
      { x: "0%", duration: DURATION.medium, ease: EASE.cinematic },
      0
    )
    // Pause at center
    .to({}, { duration: 0.2 })
    // Navigation happens
    .add(() => onMiddle?.())
    // Panels slide out
    .to(leftPanel, {
      x: "-100%",
      duration: DURATION.medium,
      ease: EASE.cinematic,
    })
    .to(
      rightPanel,
      { x: "100%", duration: DURATION.medium, ease: EASE.cinematic },
      "<"
    );

  return tl;
};

/**
 * Creates wipe transition
 * Color wipes across screen
 *
 * @param {HTMLElement} wipeElement - Wipe overlay element
 * @param {string} direction - Wipe direction (left, right, up, down)
 * @param {Function} onMiddle - Callback when screen is covered
 */
export const createWipeTransition = (
  wipeElement,
  direction = "right",
  onMiddle
) => {
  const tl = gsap.timeline();

  if (prefersReducedMotion()) {
    tl.add(() => onMiddle?.());
    return tl;
  }

  const directions = {
    right: {
      start: { x: "-100%", y: 0 },
      middle: { x: "0%", y: 0 },
      end: { x: "100%", y: 0 },
    },
    left: {
      start: { x: "100%", y: 0 },
      middle: { x: "0%", y: 0 },
      end: { x: "-100%", y: 0 },
    },
    up: {
      start: { x: 0, y: "100%" },
      middle: { x: 0, y: "0%" },
      end: { x: 0, y: "-100%" },
    },
    down: {
      start: { x: 0, y: "-100%" },
      middle: { x: 0, y: "0%" },
      end: { x: 0, y: "100%" },
    },
  };

  const dir = directions[direction];

  tl.set(wipeElement, { ...dir.start, display: "block" })
    .to(wipeElement, {
      ...dir.middle,
      duration: DURATION.medium,
      ease: EASE.cinematic,
    })
    .add(() => onMiddle?.())
    .to({}, { duration: 0.1 })
    .to(wipeElement, {
      ...dir.end,
      duration: DURATION.medium,
      ease: EASE.cinematic,
    })
    .set(wipeElement, { display: "none" });

  return tl;
};

// ═══════════════════════════════════════════════════════════════════════════
// ROUTE-SPECIFIC ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates route-specific entrance animation
 * Different pages can have unique entrances
 *
 * @param {HTMLElement} page - Page container
 * @param {string} route - Route name for specific animation
 */
export const createRouteEntrance = (page, route) => {
  if (prefersReducedMotion()) {
    return gsap.set(page, { opacity: 1 });
  }

  const tl = gsap.timeline();

  switch (route) {
    case "home":
      // Hero-style dramatic entrance
      tl.fromTo(
        page,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: DURATION.slow,
          ease: EASE.cinematic,
        }
      );
      break;

    case "collection":
    case "products":
      // Slide up for product pages
      tl.fromTo(
        page,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.medium,
          ease: EASE.smooth,
        }
      );
      break;

    case "about":
    case "contact":
      // Fade in for informational pages
      tl.fromTo(
        page,
        { opacity: 0 },
        {
          opacity: 1,
          duration: DURATION.medium,
          ease: EASE.smooth,
        }
      );
      break;

    case "product":
      // Scale reveal for product detail
      tl.fromTo(
        page,
        { opacity: 0, scale: 1.02 },
        {
          opacity: 1,
          scale: 1,
          duration: DURATION.medium,
          ease: EASE.smooth,
        }
      );
      break;

    default:
      tl.fromTo(
        page,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.normal,
          ease: EASE.smooth,
        }
      );
  }

  return tl;
};

// ═══════════════════════════════════════════════════════════════════════════
// TRANSITION UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Kills all running transition animations
 * Call before starting new transition
 */
export const killTransitions = () => {
  gsap.killTweensOf("#page-transition-overlay");
  gsap.killTweensOf("[data-page]");
};

/**
 * Resets page to initial visible state
 *
 * @param {HTMLElement} page - Page element to reset
 */
export const resetPage = (page) => {
  gsap.set(page, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    clearProps: "all",
  });
};
