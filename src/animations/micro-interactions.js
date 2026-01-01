/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MICRO-INTERACTIONS
 * Luxury Feel Hover Effects & UI Animations
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { gsap, EASE, DURATION, prefersReducedMotion } from "./config";

// ═══════════════════════════════════════════════════════════════════════════
// MAGNETIC HOVER EFFECT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates magnetic hover effect for buttons
 * Button follows cursor with smooth magnetic pull
 *
 * @param {HTMLElement} element - Element to apply effect to
 * @param {Object} options - Effect options
 */
export const createMagneticHover = (element, options = {}) => {
  const {
    strength = 0.3, // How strong the magnetic pull is (0-1)
    radius: _radius = 100, // How far the effect reaches (pixels) - kept for API compatibility
    duration = 0.4, // Animation duration
  } = options;
  void _radius; // Radius reserved for future use

  if (prefersReducedMotion()) return null;

  let bounds;
  let isHovering = false;

  const updateBounds = () => {
    bounds = element.getBoundingClientRect();
  };

  const handleMouseMove = (e) => {
    if (!isHovering) return;

    const x = e.clientX - bounds.left - bounds.width / 2;
    const y = e.clientY - bounds.top - bounds.height / 2;

    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      duration,
      ease: EASE.smooth,
    });
  };

  const handleMouseEnter = () => {
    isHovering = true;
    updateBounds();
    document.addEventListener("mousemove", handleMouseMove);
  };

  const handleMouseLeave = () => {
    isHovering = false;
    document.removeEventListener("mousemove", handleMouseMove);

    gsap.to(element, {
      x: 0,
      y: 0,
      duration,
      ease: EASE.softBounce,
    });
  };

  element.addEventListener("mouseenter", handleMouseEnter);
  element.addEventListener("mouseleave", handleMouseLeave);

  // Return cleanup function
  return () => {
    element.removeEventListener("mouseenter", handleMouseEnter);
    element.removeEventListener("mouseleave", handleMouseLeave);
    document.removeEventListener("mousemove", handleMouseMove);
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// BUTTON HOVER EFFECTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates premium button hover animation
 * Scale + shadow + color shift
 *
 * @param {HTMLElement} button - Button element
 * @param {Object} options - Animation options
 */
export const createButtonHover = (button, options = {}) => {
  const {
    scale = 1.02,
    shadowColor = "rgba(0, 103, 255, 0.3)",
    shadowBlur = 30,
  } = options;

  if (prefersReducedMotion()) return null;

  const tl = gsap.timeline({ paused: true });

  tl.to(button, {
    scale,
    boxShadow: `0 10px ${shadowBlur}px ${shadowColor}`,
    duration: DURATION.fast,
    ease: EASE.smooth,
  });

  button.addEventListener("mouseenter", () => tl.play());
  button.addEventListener("mouseleave", () => tl.reverse());

  return tl;
};

/**
 * Creates button press/click animation
 * Quick scale down then up
 *
 * @param {HTMLElement} button - Button element
 */
export const createButtonPress = (button) => {
  if (prefersReducedMotion()) return null;

  const handlePress = () => {
    gsap.to(button, {
      scale: 0.95,
      duration: DURATION.instant,
      ease: EASE.smooth,
    });
  };

  const handleRelease = () => {
    gsap.to(button, {
      scale: 1,
      duration: DURATION.fast,
      ease: EASE.softBounce,
    });
  };

  button.addEventListener("mousedown", handlePress);
  button.addEventListener("mouseup", handleRelease);
  button.addEventListener("mouseleave", handleRelease);

  return () => {
    button.removeEventListener("mousedown", handlePress);
    button.removeEventListener("mouseup", handleRelease);
    button.removeEventListener("mouseleave", handleRelease);
  };
};

/**
 * Creates ripple effect on button click
 * Material-design style ripple
 *
 * @param {HTMLElement} button - Button element
 */
export const createRippleEffect = (button) => {
  if (prefersReducedMotion()) return null;

  button.style.position = "relative";
  button.style.overflow = "hidden";

  const handleClick = (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      transform: translate(-50%, -50%);
      pointer-events: none;
    `;

    button.appendChild(ripple);

    gsap.to(ripple, {
      width: rect.width * 2.5,
      height: rect.width * 2.5,
      opacity: 0,
      duration: DURATION.medium,
      ease: EASE.smooth,
      onComplete: () => ripple.remove(),
    });
  };

  button.addEventListener("click", handleClick);

  return () => button.removeEventListener("click", handleClick);
};

// ═══════════════════════════════════════════════════════════════════════════
// ICON HOVER EFFECTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates icon float hover effect
 * Subtle lift + scale
 *
 * @param {HTMLElement} icon - Icon element
 */
export const createIconFloat = (icon) => {
  if (prefersReducedMotion()) return null;

  const tl = gsap.timeline({ paused: true });

  tl.to(icon, {
    y: -3,
    scale: 1.1,
    duration: DURATION.fast,
    ease: EASE.smooth,
  });

  icon.addEventListener("mouseenter", () => tl.play());
  icon.addEventListener("mouseleave", () => tl.reverse());

  return tl;
};

/**
 * Creates icon bounce hover effect
 * Playful bounce animation
 *
 * @param {HTMLElement} icon - Icon element
 */
export const createIconBounce = (icon) => {
  if (prefersReducedMotion()) return null;

  const tl = gsap.timeline({ paused: true });

  tl.to(icon, {
    y: -5,
    scale: 1.15,
    duration: DURATION.fast,
    ease: EASE.softBounce,
  });

  icon.addEventListener("mouseenter", () => tl.play());
  icon.addEventListener("mouseleave", () => tl.reverse());

  return tl;
};

/**
 * Creates icon rotate hover effect
 * Subtle rotation on hover
 *
 * @param {HTMLElement} icon - Icon element
 * @param {number} degrees - Rotation amount in degrees
 */
export const createIconRotate = (icon, degrees = 15) => {
  if (prefersReducedMotion()) return null;

  const tl = gsap.timeline({ paused: true });

  tl.to(icon, {
    rotation: degrees,
    scale: 1.1,
    duration: DURATION.fast,
    ease: EASE.softBounce,
  });

  icon.addEventListener("mouseenter", () => tl.play());
  icon.addEventListener("mouseleave", () => tl.reverse());

  return tl;
};

// ═══════════════════════════════════════════════════════════════════════════
// CARD HOVER EFFECTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates premium card hover effect
 * Lift + shadow + image zoom
 *
 * @param {HTMLElement} card - Card element
 * @param {HTMLElement} image - Image inside card (optional)
 */
export const createCardHover = (card, image = null) => {
  if (prefersReducedMotion()) return null;

  const tl = gsap.timeline({ paused: true });

  // Card lift effect
  tl.to(card, {
    y: -10,
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
    duration: DURATION.normal,
    ease: EASE.smooth,
  });

  // Image zoom if provided
  if (image) {
    tl.to(
      image,
      {
        scale: 1.08,
        duration: DURATION.slow,
        ease: EASE.smooth,
      },
      0
    );
  }

  card.addEventListener("mouseenter", () => tl.play());
  card.addEventListener("mouseleave", () => tl.reverse());

  return tl;
};

/**
 * Creates 3D tilt card effect
 * Card tilts towards cursor
 *
 * @param {HTMLElement} card - Card element
 * @param {Object} options - Effect options
 */
export const createTiltCard = (card, options = {}) => {
  const {
    maxTilt = 10, // Maximum tilt in degrees
    perspective = 1000,
    scale = 1.02,
  } = options;

  if (prefersReducedMotion()) return null;

  card.style.transformStyle = "preserve-3d";
  card.style.perspective = `${perspective}px`;

  let bounds;
  let isHovering = false;

  const updateBounds = () => {
    bounds = card.getBoundingClientRect();
  };

  const handleMouseMove = (e) => {
    if (!isHovering) return;

    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    gsap.to(card, {
      rotateX,
      rotateY,
      scale,
      duration: DURATION.fast,
      ease: EASE.smooth,
    });
  };

  const handleMouseEnter = () => {
    isHovering = true;
    updateBounds();
    document.addEventListener("mousemove", handleMouseMove);
  };

  const handleMouseLeave = () => {
    isHovering = false;
    document.removeEventListener("mousemove", handleMouseMove);

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: DURATION.normal,
      ease: EASE.smooth,
    });
  };

  card.addEventListener("mouseenter", handleMouseEnter);
  card.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    card.removeEventListener("mouseenter", handleMouseEnter);
    card.removeEventListener("mouseleave", handleMouseLeave);
    document.removeEventListener("mousemove", handleMouseMove);
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// INPUT EFFECTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates input focus glow animation
 *
 * @param {HTMLElement} input - Input element
 * @param {Object} options - Animation options
 */
export const createInputFocusGlow = (input, options = {}) => {
  const {
    glowColor = "rgba(0, 103, 255, 0.25)",
    glowSize: _glowSize = 15, // Reserved for future use with box-shadow spread
  } = options;
  void _glowSize; // Kept for API compatibility

  if (prefersReducedMotion()) return null;

  const handleFocus = () => {
    gsap.to(input, {
      boxShadow: `0 0 0 4px ${glowColor}`,
      borderColor: "#0067FF",
      duration: DURATION.fast,
      ease: EASE.smooth,
    });
  };

  const handleBlur = () => {
    gsap.to(input, {
      boxShadow: "0 0 0 0px transparent",
      borderColor: "#e5e7eb",
      duration: DURATION.fast,
      ease: EASE.smooth,
    });
  };

  input.addEventListener("focus", handleFocus);
  input.addEventListener("blur", handleBlur);

  return () => {
    input.removeEventListener("focus", handleFocus);
    input.removeEventListener("blur", handleBlur);
  };
};

/**
 * Creates floating label animation
 * Label floats up when input is focused or has value
 *
 * @param {HTMLElement} input - Input element
 * @param {HTMLElement} label - Label element
 */
export const createFloatingLabel = (input, label) => {
  if (prefersReducedMotion()) {
    return null;
  }

  const floatUp = () => {
    gsap.to(label, {
      y: -25,
      scale: 0.85,
      color: "#0067FF",
      duration: DURATION.fast,
      ease: EASE.smooth,
    });
  };

  const floatDown = () => {
    if (input.value.trim() !== "") return;

    gsap.to(label, {
      y: 0,
      scale: 1,
      color: "#6b7280",
      duration: DURATION.fast,
      ease: EASE.smooth,
    });
  };

  input.addEventListener("focus", floatUp);
  input.addEventListener("blur", floatDown);

  // Check initial value
  if (input.value.trim() !== "") {
    floatUp();
  }

  return () => {
    input.removeEventListener("focus", floatUp);
    input.removeEventListener("blur", floatDown);
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// CURSOR EFFECTS (PREMIUM)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates custom cursor follower
 * Premium animated cursor that follows mouse
 *
 * @param {Object} options - Cursor options
 */
export const createCursorFollower = (options = {}) => {
  const { size = 20, color = "rgba(0, 103, 255, 0.5)", delay = 0.1 } = options;

  if (prefersReducedMotion()) return null;

  // Create cursor element
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  cursor.style.cssText = `
    position: fixed;
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    transform: translate(-50%, -50%);
  `;
  document.body.appendChild(cursor);

  // Follow cursor
  const handleMouseMove = (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: delay,
      ease: "power2.out",
    });
  };

  // Scale on hover interactive elements
  const handleMouseEnter = () => {
    gsap.to(cursor, {
      scale: 2,
      duration: DURATION.fast,
      ease: EASE.smooth,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cursor, {
      scale: 1,
      duration: DURATION.fast,
      ease: EASE.smooth,
    });
  };

  document.addEventListener("mousemove", handleMouseMove);

  // Add hover effect to interactive elements
  const interactiveElements = document.querySelectorAll(
    "a, button, [data-cursor]"
  );
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
  });

  return () => {
    cursor.remove();
    document.removeEventListener("mousemove", handleMouseMove);
    interactiveElements.forEach((el) => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    });
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// LOADING ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates skeleton loading pulse animation
 *
 * @param {HTMLElement|NodeList} elements - Skeleton elements
 */
export const createSkeletonPulse = (elements) => {
  if (prefersReducedMotion()) return null;

  return gsap.to(elements, {
    opacity: 0.5,
    duration: 0.8,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
};

/**
 * Creates content reveal after loading
 * Replace skeleton with actual content
 *
 * @param {HTMLElement} skeleton - Skeleton element
 * @param {HTMLElement} content - Real content element
 */
export const createLoadingReveal = (skeleton, content) => {
  const tl = gsap.timeline();

  if (prefersReducedMotion()) {
    tl.set(skeleton, { display: "none" });
    tl.set(content, { display: "block", opacity: 1 });
    return tl;
  }

  tl.to(skeleton, {
    opacity: 0,
    duration: DURATION.fast,
    ease: EASE.smooth,
  })
    .set(skeleton, { display: "none" })
    .set(content, { display: "block", opacity: 0, y: 20 })
    .to(content, {
      opacity: 1,
      y: 0,
      duration: DURATION.normal,
      ease: EASE.smooth,
    });

  return tl;
};
