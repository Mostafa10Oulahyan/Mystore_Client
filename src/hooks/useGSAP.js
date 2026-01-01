/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REACT GSAP HOOKS
 * Premium Animation Hooks for React with Automatic Cleanup
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Design Principles:
 * - useLayoutEffect for DOM measurements (before paint)
 * - gsap.context() for proper cleanup
 * - Respect prefers-reduced-motion
 * - Reusable, composable hooks
 */

import { useEffect, useRef, useLayoutEffect, useState } from "react";
import {
  gsap,
  ScrollTrigger,
  EASE,
  DURATION,
  prefersReducedMotion,
} from "../animations/config";

import {
  createHeroTimeline,
  createSectionReveal,
  createBlurReveal,
  createCardStagger,
  createParallax,
  createCardHover,
  createButtonHover,
  createMagneticHover,
  createInputFocusGlow,
  createSmartNavbar,
  createPageEnter,
} from "../animations";

// Use useLayoutEffect on client, useEffect on server (SSR safety)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// ═══════════════════════════════════════════════════════════════════════════
// CORE GSAP HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Main GSAP hook with automatic context and cleanup
 * Use this for custom animations
 *
 * @param {Function} callback - Animation callback receiving the container element
 * @param {Array} dependencies - React dependencies array
 * @returns {React.RefObject} - Container ref to attach to element
 *
 * @example
 * const containerRef = useGSAP((container) => {
 *   gsap.from(container.querySelectorAll('.item'), {
 *     opacity: 0,
 *     y: 50,
 *     stagger: 0.1,
 *   });
 * }, []);
 */
export const useGSAP = (callback, dependencies = []) => {
  const containerRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return;

    // Create GSAP context for scoped animations
    const ctx = gsap.context(() => {
      callback(containerRef.current);
    }, containerRef);

    // Cleanup on unmount
    return () => ctx.revert();
  }, dependencies);

  return containerRef;
};

// ═══════════════════════════════════════════════════════════════════════════
// HERO ANIMATION HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook for cinematic hero section animation
 * Returns refs to attach to hero elements
 *
 * @returns {Object} - Object containing refs for each hero element
 *
 * @example
 * const { containerRef, titleRef, subtitleRef, ctaRef, imageRef } = useHeroAnimation();
 *
 * return (
 *   <section ref={containerRef}>
 *     <h1 ref={titleRef}>Welcome</h1>
 *     <p ref={subtitleRef}>Subtitle</p>
 *     <button ref={ctaRef}>Shop Now</button>
 *     <img ref={imageRef} src="..." />
 *   </section>
 * );
 */
export const useHeroAnimation = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const imageRef = useRef(null);
  const badgesRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = createHeroTimeline({
        container: containerRef.current,
        title: titleRef.current,
        subtitle: subtitleRef.current,
        description: descriptionRef.current,
        cta: ctaRef.current,
        image: imageRef.current,
        badges: badgesRef.current,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return {
    containerRef,
    titleRef,
    subtitleRef,
    descriptionRef,
    ctaRef,
    imageRef,
    badgesRef,
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL ANIMATION HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook for scroll-triggered fade in animation
 *
 * @param {Object} options - Animation options
 * @returns {React.RefObject} - Ref to attach to element
 */
export const useFadeIn = (options = {}) => {
  const elementRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!elementRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      createSectionReveal(elementRef.current, options);
    });

    return () => ctx.revert();
  }, []);

  return elementRef;
};

/**
 * Hook for blur + fade reveal animation
 *
 * @param {Object} options - Animation options
 * @returns {React.RefObject} - Ref to attach to element
 */
export const useBlurReveal = (options = {}) => {
  const elementRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!elementRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      createBlurReveal(elementRef.current, options);
    });

    return () => ctx.revert();
  }, []);

  return elementRef;
};

/**
 * Hook for staggered children animation
 *
 * @param {Object} options - Animation options
 * @returns {React.RefObject} - Ref to attach to container
 */
export const useStaggerChildren = (options = {}) => {
  const containerRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      createCardStagger(containerRef.current, options);
    });

    return () => ctx.revert();
  }, []);

  return containerRef;
};

/**
 * Hook for parallax effect
 *
 * @param {Object} options - Parallax options
 * @returns {React.RefObject} - Ref to attach to image
 */
export const useParallax = (options = {}) => {
  const imageRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!imageRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      createParallax(imageRef.current, options);
    });

    return () => ctx.revert();
  }, []);

  return imageRef;
};

// ═══════════════════════════════════════════════════════════════════════════
// HOVER ANIMATION HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook for card hover effect
 *
 * @returns {Object} - Object with cardRef and optional imageRef
 */
export const useCardHover = () => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!cardRef.current || prefersReducedMotion()) return;

    const cleanup = createCardHover(cardRef.current, imageRef.current);

    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  return { cardRef, imageRef };
};

/**
 * Hook for button hover effect
 *
 * @param {Object} options - Animation options
 * @returns {React.RefObject} - Ref to attach to button
 */
export const useButtonHover = (options = {}) => {
  const buttonRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!buttonRef.current || prefersReducedMotion()) return;

    const tl = createButtonHover(buttonRef.current, options);

    return () => {
      if (tl) tl.kill();
    };
  }, []);

  return buttonRef;
};

/**
 * Hook for magnetic hover effect
 *
 * @param {Object} options - Magnetic options
 * @returns {React.RefObject} - Ref to attach to element
 */
export const useMagneticHover = (options = {}) => {
  const elementRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!elementRef.current || prefersReducedMotion()) return;

    const cleanup = createMagneticHover(elementRef.current, options);

    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  return elementRef;
};

/**
 * Hook for image zoom on hover
 */
export const useImageHover = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current || !imageRef.current || prefersReducedMotion())
      return;

    const tl = gsap.timeline({ paused: true });
    tl.to(imageRef.current, {
      scale: 1.1,
      duration: DURATION.slow,
      ease: EASE.smooth,
    });

    const handleEnter = () => tl.play();
    const handleLeave = () => tl.reverse();

    containerRef.current.addEventListener("mouseenter", handleEnter);
    containerRef.current.addEventListener("mouseleave", handleLeave);

    return () => {
      containerRef.current?.removeEventListener("mouseenter", handleEnter);
      containerRef.current?.removeEventListener("mouseleave", handleLeave);
      tl.kill();
    };
  }, []);

  return { containerRef, imageRef };
};

// ═══════════════════════════════════════════════════════════════════════════
// INPUT ANIMATION HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook for input focus glow effect
 *
 * @param {Object} options - Animation options
 * @returns {React.RefObject} - Ref to attach to input
 */
export const useInputGlow = (options = {}) => {
  const inputRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!inputRef.current || prefersReducedMotion()) return;

    const cleanup = createInputFocusGlow(inputRef.current, options);

    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  return inputRef;
};

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook for smart hide/show navbar on scroll
 *
 * @param {Object} options - Navigation options
 * @returns {React.RefObject} - Ref to attach to navbar
 */
export const useSmartNavbar = (options = {}) => {
  const navRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!navRef.current || prefersReducedMotion()) return;

    const cleanup = createSmartNavbar(navRef.current, options);

    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  return navRef;
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE TRANSITION HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook for page entrance animation
 *
 * @param {string} route - Current route name for specific animation
 * @returns {React.RefObject} - Ref to attach to page container
 */
export const usePageEntrance = (route = "default") => {
  const pageRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      createPageEnter(pageRef.current, "up");
    });

    return () => ctx.revert();
  }, [route]);

  return pageRef;
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook to check if user prefers reduced motion
 *
 * @returns {boolean} - Whether reduced motion is preferred
 */
export const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return reducedMotion;
};

/**
 * Hook to refresh ScrollTrigger when content changes
 * Useful after dynamic content loads
 */
export const useScrollTriggerRefresh = (dependencies = []) => {
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, dependencies);
};

/**
 * Hook for scroll progress indicator
 */
export const useScrollProgress = () => {
  const progressRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!progressRef.current) return;

    gsap.set(progressRef.current, {
      scaleX: 0,
      transformOrigin: "left center",
    });

    const animation = gsap.to(progressRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });

    return () => {
      if (animation.scrollTrigger) animation.scrollTrigger.kill();
      animation.kill();
    };
  }, []);

  return progressRef;
};

/**
 * Hook for scroll-triggered animation with IntersectionObserver fallback
 * More performant for many elements
 *
 * @param {Object} options - Animation options
 * @returns {React.RefObject} - Ref to attach to element
 */
export const useScrollAnimation = (options = {}) => {
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  const {
    threshold = 0.2,
    once = true,
    animation = {
      from: { opacity: 0, y: 50 },
      to: { opacity: 1, y: 0 },
    },
    duration = DURATION.normal,
    ease = EASE.smooth,
    delay = 0,
  } = options;

  useEffect(() => {
    if (!elementRef.current || prefersReducedMotion()) return;

    const element = elementRef.current;

    // Set initial state
    gsap.set(element, animation.from);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!once || !hasAnimated.current)) {
            hasAnimated.current = true;

            gsap.to(element, {
              ...animation.to,
              duration,
              ease,
              delay,
            });

            if (once) observer.unobserve(element);
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return elementRef;
};

// ═══════════════════════════════════════════════════════════════════════════
// DATA ATTRIBUTE BASED ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook for automatic animations based on data attributes
 * Add data-animate="fade-up" to any element
 *
 * @returns {React.RefObject} - Ref to attach to container
 *
 * @example
 * const containerRef = useAutoAnimate();
 *
 * return (
 *   <div ref={containerRef}>
 *     <h1 data-animate="fade-up">Title</h1>
 *     <p data-animate="fade-up" data-delay="0.2">Paragraph</p>
 *   </div>
 * );
 */
export const useAutoAnimate = () => {
  const containerRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const elements = containerRef.current.querySelectorAll("[data-animate]");

      elements.forEach((element) => {
        const animationType = element.dataset.animate;
        const delay = parseFloat(element.dataset.delay) || 0;
        const duration =
          parseFloat(element.dataset.duration) || DURATION.normal;

        const animations = {
          "fade-up": {
            from: { opacity: 0, y: 50 },
            to: { opacity: 1, y: 0 },
          },
          "fade-down": {
            from: { opacity: 0, y: -50 },
            to: { opacity: 1, y: 0 },
          },
          "fade-left": {
            from: { opacity: 0, x: -50 },
            to: { opacity: 1, x: 0 },
          },
          "fade-right": {
            from: { opacity: 0, x: 50 },
            to: { opacity: 1, x: 0 },
          },
          "scale-up": {
            from: { opacity: 0, scale: 0.9 },
            to: { opacity: 1, scale: 1 },
          },
          "blur-in": {
            from: { opacity: 0, filter: "blur(15px)" },
            to: { opacity: 1, filter: "blur(0px)" },
          },
        };

        const anim = animations[animationType];
        if (!anim) return;

        // Set initial visibility to ensure content is never hidden
        gsap.set(element, anim.to);

        gsap.fromTo(element, anim.from, {
          ...anim.to,
          duration,
          delay,
          ease: EASE.smooth,
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none none", // Never reverse - content stays visible
            once: true, // Only animate once
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
};

// Export all hooks
export { useIsomorphicLayoutEffect, EASE, DURATION, gsap, ScrollTrigger };
