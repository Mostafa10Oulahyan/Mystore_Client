/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ANIMATIONS INDEX
 * Central Export for All Animation Functions
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Usage:
 * import { createHeroTimeline, createCardHover, EASE, DURATION } from '@/animations';
 *
 * Or import specific modules:
 * import { createHeroTimeline } from '@/animations/hero';
 */

// ─────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────

export {
  gsap,
  ScrollTrigger,
  EASE,
  DURATION,
  SCROLL_DEFAULTS,
  SCROLL_SCRUB,
  ANIMATION_DEFAULTS,
  prefersReducedMotion,
  BREAKPOINTS,
  isMobile,
  isTablet,
} from "./config";

// ─────────────────────────────────────────────────────────────────────────
// HERO ANIMATIONS
// ─────────────────────────────────────────────────────────────────────────

export {
  createHeroTimeline,
  startCTAFloat,
  startBadgesFloat,
  createTextReveal,
  createCharacterReveal,
  createGradientAnimation,
  createHeroParallax,
  createImageReveal,
} from "./hero";

// ─────────────────────────────────────────────────────────────────────────
// SCROLL ANIMATIONS
// ─────────────────────────────────────────────────────────────────────────

export {
  createSectionReveal,
  createBlurReveal,
  createCardStagger,
  createWaterfallStagger,
  createParallax,
  createLayeredParallax,
  createPinnedSection,
  createHorizontalScroll,
  createScrubScale,
  createScrubTextReveal,
  createScrollProgress,
  createBatchAnimation,
  refreshScrollTriggers,
  killAllScrollTriggers,
} from "./scroll";

// ─────────────────────────────────────────────────────────────────────────
// NAVIGATION ANIMATIONS
// ─────────────────────────────────────────────────────────────────────────

export {
  createSmartNavbar,
  createNavbarEntrance,
  createMobileMenuTimeline,
  createHamburgerTimeline,
  createUnderlineHover,
  createDirectionalUnderline,
  createDropdownTimeline,
  createSearchExpandTimeline,
} from "./navigation";

// ─────────────────────────────────────────────────────────────────────────
// MICRO-INTERACTIONS
// ─────────────────────────────────────────────────────────────────────────

export {
  createMagneticHover,
  createButtonHover,
  createButtonPress,
  createRippleEffect,
  createIconFloat,
  createIconBounce,
  createIconRotate,
  createCardHover,
  createTiltCard,
  createInputFocusGlow,
  createFloatingLabel,
  createCursorFollower,
  createSkeletonPulse,
  createLoadingReveal,
} from "./micro-interactions";

// ─────────────────────────────────────────────────────────────────────────
// PAGE TRANSITIONS
// ─────────────────────────────────────────────────────────────────────────

export {
  createTransitionOverlay,
  createPageExit,
  createOverlayExit,
  createPageEnter,
  createOverlayEnter,
  createFullTransition,
  createSplitTransition,
  createWipeTransition,
  createRouteEntrance,
  killTransitions,
  resetPage,
} from "./transitions";
