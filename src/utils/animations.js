/**
 * GSAP Animation Utilities
 * A comprehensive collection of reusable animation functions for React
 * Uses GSAP with ScrollTrigger for professional, smooth animations
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ============================================
// CONFIGURATION & DEFAULTS
// ============================================

export const EASE = {
  smooth: "power2.out",
  smoothInOut: "power2.inOut",
  bounce: "back.out(1.7)",
  elastic: "elastic.out(1, 0.3)",
  snappy: "power4.out",
  gentle: "power1.out",
  expo: "expo.out",
};

export const DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  verySlow: 1.2,
};

// ============================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================

/**
 * Fade in animation triggered on scroll
 * @param {string|Element} element - Element selector or ref
 * @param {Object} options - Animation options
 */
export const fadeInOnScroll = (element, options = {}) => {
  const {
    delay = 0,
    duration = DURATION.normal,
    y = 30,
    x = 0,
    scale = 1,
    start = "top 85%",
    end = "top 20%",
    toggleActions = "play none none reverse",
    markers = false,
  } = options;

  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y,
      x,
      scale: scale === 1 ? 1 : 0.95,
    },
    {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration,
      delay,
      ease: EASE.smooth,
      scrollTrigger: {
        trigger: element,
        start,
        end,
        toggleActions,
        markers,
      },
    }
  );
};

/**
 * Slide in from left on scroll
 */
export const slideInLeftOnScroll = (element, options = {}) => {
  return fadeInOnScroll(element, { ...options, x: -50, y: 0 });
};

/**
 * Slide in from right on scroll
 */
export const slideInRightOnScroll = (element, options = {}) => {
  return fadeInOnScroll(element, { ...options, x: 50, y: 0 });
};

/**
 * Scale up animation on scroll
 */
export const scaleUpOnScroll = (element, options = {}) => {
  const {
    delay = 0,
    duration = DURATION.slow,
    start = "top 85%",
    toggleActions = "play none none reverse",
  } = options;

  return gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.8,
    },
    {
      opacity: 1,
      scale: 1,
      duration,
      delay,
      ease: EASE.bounce,
      scrollTrigger: {
        trigger: element,
        start,
        toggleActions,
      },
    }
  );
};

// ============================================
// STAGGERED ANIMATIONS
// ============================================

/**
 * Staggered fade in for multiple elements
 * Perfect for lists, cards, and grid items
 * @param {string|Element[]} elements - Elements selector or refs
 * @param {Object} options - Animation options
 */
export const staggerFadeIn = (elements, options = {}) => {
  const {
    stagger = 0.1,
    duration = DURATION.normal,
    y = 40,
    delay = 0,
    start = "top 85%",
    toggleActions = "play none none reverse",
  } = options;

  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease: EASE.smooth,
      scrollTrigger: {
        trigger: elements[0] || elements,
        start,
        toggleActions,
      },
    }
  );
};

/**
 * Staggered scale animation for cards
 */
export const staggerScaleIn = (elements, options = {}) => {
  const {
    stagger = 0.08,
    duration = DURATION.normal,
    delay = 0,
    start = "top 85%",
  } = options;

  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease: EASE.bounce,
      scrollTrigger: {
        trigger: elements[0] || elements,
        start,
        toggleActions: "play none none reverse",
      },
    }
  );
};

// ============================================
// HOVER ANIMATIONS
// ============================================

/**
 * Button hover animation - scale and shadow effect
 * @param {Element} element - Button element
 */
export const buttonHoverAnimation = (element) => {
  const tl = gsap.timeline({ paused: true });

  tl.to(element, {
    scale: 1.02,
    boxShadow: "0 10px 30px rgba(0, 103, 255, 0.3)",
    duration: DURATION.fast,
    ease: EASE.smooth,
  });

  element.addEventListener("mouseenter", () => tl.play());
  element.addEventListener("mouseleave", () => tl.reverse());

  return tl;
};

/**
 * Image hover animation - zoom effect
 * @param {Element} imageContainer - Container element with overflow hidden
 * @param {Element} image - Image element
 */
export const imageHoverAnimation = (imageContainer, image) => {
  const tl = gsap.timeline({ paused: true });

  tl.to(image, {
    scale: 1.1,
    duration: DURATION.slow,
    ease: EASE.smooth,
  });

  imageContainer.addEventListener("mouseenter", () => tl.play());
  imageContainer.addEventListener("mouseleave", () => tl.reverse());

  return tl;
};

/**
 * Card hover animation - lift effect
 * @param {Element} card - Card element
 */
export const cardHoverAnimation = (card) => {
  const tl = gsap.timeline({ paused: true });

  tl.to(card, {
    y: -8,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    duration: DURATION.fast,
    ease: EASE.smooth,
  });

  card.addEventListener("mouseenter", () => tl.play());
  card.addEventListener("mouseleave", () => tl.reverse());

  return tl;
};

/**
 * Icon hover animation - bounce effect
 */
export const iconHoverAnimation = (element) => {
  const tl = gsap.timeline({ paused: true });

  tl.to(element, {
    scale: 1.2,
    rotate: 5,
    duration: DURATION.fast,
    ease: EASE.bounce,
  });

  element.addEventListener("mouseenter", () => tl.play());
  element.addEventListener("mouseleave", () => tl.reverse());

  return tl;
};

// ============================================
// PAGE TRANSITIONS
// ============================================

/**
 * Hero section entrance animation
 */
export const heroEntrance = (elements) => {
  const tl = gsap.timeline();

  // Animate title
  if (elements.title) {
    tl.fromTo(
      elements.title,
      { opacity: 0, y: 50, clipPath: "inset(100% 0 0 0)" },
      {
        opacity: 1,
        y: 0,
        clipPath: "inset(0% 0 0 0)",
        duration: DURATION.slow,
        ease: EASE.expo,
      }
    );
  }

  // Animate subtitle
  if (elements.subtitle) {
    tl.fromTo(
      elements.subtitle,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: DURATION.normal, ease: EASE.smooth },
      "-=0.4"
    );
  }

  // Animate CTA buttons
  if (elements.buttons) {
    tl.fromTo(
      elements.buttons,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: DURATION.normal,
        stagger: 0.1,
        ease: EASE.smooth,
      },
      "-=0.3"
    );
  }

  // Animate image
  if (elements.image) {
    tl.fromTo(
      elements.image,
      { opacity: 0, scale: 0.95, x: 50 },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: DURATION.slow,
        ease: EASE.smooth,
      },
      "-=0.5"
    );
  }

  return tl;
};

// ============================================
// SPECIAL EFFECTS
// ============================================

/**
 * Parallax effect on scroll
 */
export const parallaxEffect = (element, options = {}) => {
  const { speed = 0.5, direction = "y" } = options;

  return gsap.to(element, {
    [direction]: () => ScrollTrigger.maxScroll(window) * speed * -0.1,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
};

/**
 * Counter animation for numbers
 */
export const animateCounter = (element, options = {}) => {
  const { endValue = 100, duration = 2, prefix = "", suffix = "" } = options;

  const obj = { value: 0 };

  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: EASE.smoothInOut,
    onUpdate: () => {
      element.textContent = `${prefix}${Math.round(obj.value)}${suffix}`;
    },
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });
};

/**
 * Text reveal animation (character by character)
 */
export const textReveal = (element, options = {}) => {
  const { duration = 0.05, stagger = 0.03 } = options;
  const text = element.textContent;
  element.innerHTML = "";

  // Wrap each character in a span
  text.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.display = "inline-block";
    span.style.opacity = "0";
    element.appendChild(span);
  });

  const chars = element.querySelectorAll("span");

  return gsap.to(chars, {
    opacity: 1,
    y: 0,
    duration,
    stagger,
    ease: EASE.smooth,
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Kill all ScrollTriggers - use in cleanup
 */
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};

/**
 * Refresh ScrollTrigger after DOM changes
 */
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};

/**
 * Create responsive animation based on screen size
 */
export const responsiveAnimation = (element, desktopAnim, mobileAnim) => {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    return desktopAnim(element);
  });

  mm.add("(max-width: 767px)", () => {
    return mobileAnim(element);
  });

  return mm;
};

/**
 * Batch animation for many elements (performance optimized)
 */
export const batchAnimation = (selector, options = {}) => {
  const { y = 30, duration = DURATION.normal, stagger = 0.15 } = options;

  ScrollTrigger.batch(selector, {
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
    onLeave: (elements) => {
      gsap.to(elements, { opacity: 0, y: -y, overwrite: true });
    },
    onEnterBack: (elements) => {
      gsap.to(elements, { opacity: 1, y: 0, stagger, overwrite: true });
    },
    onLeaveBack: (elements) => {
      gsap.to(elements, { opacity: 0, y, overwrite: true });
    },
  });
};

// ============================================
// REACT HOOKS HELPERS
// ============================================

/**
 * Initialize animations for a page/component
 * Call this in useEffect with proper cleanup
 */
export const initPageAnimations = (containerRef) => {
  const ctx = gsap.context(() => {
    // Fade in sections
    gsap.utils.toArray(".gsap-fade-in").forEach((el) => {
      fadeInOnScroll(el);
    });

    // Slide in from left
    gsap.utils.toArray(".gsap-slide-left").forEach((el) => {
      slideInLeftOnScroll(el);
    });

    // Slide in from right
    gsap.utils.toArray(".gsap-slide-right").forEach((el) => {
      slideInRightOnScroll(el);
    });

    // Scale up
    gsap.utils.toArray(".gsap-scale-up").forEach((el) => {
      scaleUpOnScroll(el);
    });

    // Stagger children
    gsap.utils.toArray(".gsap-stagger-container").forEach((container) => {
      const children = container.children;
      staggerFadeIn(children);
    });

    // Button hover effects
    gsap.utils.toArray(".gsap-btn-hover").forEach((btn) => {
      buttonHoverAnimation(btn);
    });

    // Card hover effects
    gsap.utils.toArray(".gsap-card-hover").forEach((card) => {
      cardHoverAnimation(card);
    });
  }, containerRef);

  return ctx; // Return context for cleanup
};

export { gsap, ScrollTrigger };
