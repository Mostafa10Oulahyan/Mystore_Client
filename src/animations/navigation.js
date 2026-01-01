/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NAVIGATION ANIMATIONS
 * Cinematic Navbar & Menu Transitions
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  gsap,
  ScrollTrigger,
  EASE,
  DURATION,
  prefersReducedMotion,
} from "./config";

// ═══════════════════════════════════════════════════════════════════════════
// NAVBAR SHOW/HIDE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates hide-on-scroll-down, show-on-scroll-up navbar
 * With smooth, premium animation
 *
 * @param {HTMLElement} navbar - Navbar element
 * @param {Object} options - Animation options
 */
export const createSmartNavbar = (navbar, options = {}) => {
  const {
    hideDistance = 100, // Scroll distance before hiding
    showThreshold = 5, // Scroll up distance to trigger show
  } = options;

  if (prefersReducedMotion()) return null;

  let lastScrollY = 0;
  let isHidden = false;
  let scrollDelta = 0;

  const hide = () => {
    if (isHidden) return;
    isHidden = true;
    gsap.to(navbar, {
      y: "-100%",
      duration: DURATION.normal,
      ease: EASE.smooth,
    });
  };

  const show = () => {
    if (!isHidden) return;
    isHidden = false;
    gsap.to(navbar, {
      y: "0%",
      duration: DURATION.normal,
      ease: EASE.smooth,
    });
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    // Accumulate scroll delta
    if (delta > 0) {
      scrollDelta = Math.min(scrollDelta + delta, hideDistance);
    } else {
      scrollDelta = Math.max(scrollDelta + delta, -showThreshold);
    }

    // Hide when scrolled down enough
    if (scrollDelta >= hideDistance && currentScrollY > hideDistance) {
      hide();
      scrollDelta = 0;
    }

    // Show when scrolled up enough
    if (scrollDelta <= -showThreshold || currentScrollY < hideDistance) {
      show();
      scrollDelta = 0;
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Return cleanup function
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
};

/**
 * Creates navbar entrance animation
 * Premium reveal on page load
 *
 * @param {HTMLElement} navbar - Navbar element
 * @param {HTMLElement|NodeList} navItems - Nav links
 */
export const createNavbarEntrance = (navbar, navItems) => {
  const tl = gsap.timeline();

  if (prefersReducedMotion()) {
    tl.set([navbar, navItems], { opacity: 1 });
    return tl;
  }

  // Navbar container slides down
  tl.fromTo(
    navbar,
    {
      y: -100,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: DURATION.medium,
      ease: EASE.smooth,
    }
  );

  // Nav items stagger in
  if (navItems) {
    tl.fromTo(
      navItems,
      {
        opacity: 0,
        y: -20,
      },
      {
        opacity: 1,
        y: 0,
        duration: DURATION.fast,
        stagger: DURATION.stagger.fast,
        ease: EASE.smooth,
      },
      "-=0.2"
    );
  }

  return tl;
};

// ═══════════════════════════════════════════════════════════════════════════
// MOBILE MENU ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates cinematic mobile menu open/close animation
 * Full-screen overlay with staggered items
 *
 * @param {HTMLElement} menu - Mobile menu container
 * @param {HTMLElement} overlay - Background overlay
 * @param {NodeList|Array} menuItems - Menu link items
 */
export const createMobileMenuTimeline = (menu, overlay, menuItems) => {
  const tl = gsap.timeline({ paused: true });

  if (prefersReducedMotion()) {
    tl.set(menu, { display: "flex", opacity: 1 });
    return tl;
  }

  // Set initial state
  gsap.set(menu, { display: "none" });
  gsap.set(menuItems, { opacity: 0, x: -30 });

  tl
    // Show container
    .set(menu, { display: "flex" })

    // Fade in overlay with blur
    .fromTo(
      overlay,
      {
        opacity: 0,
        backdropFilter: "blur(0px)",
      },
      {
        opacity: 1,
        backdropFilter: "blur(10px)",
        duration: DURATION.normal,
        ease: EASE.smooth,
      }
    )

    // Slide menu from left
    .fromTo(
      menu,
      {
        x: "-100%",
      },
      {
        x: "0%",
        duration: DURATION.medium,
        ease: EASE.cinematic,
      },
      "-=0.3"
    )

    // Stagger menu items
    .to(
      menuItems,
      {
        opacity: 1,
        x: 0,
        duration: DURATION.fast,
        stagger: DURATION.stagger.fast,
        ease: EASE.smooth,
      },
      "-=0.2"
    );

  return tl;
};

/**
 * Creates hamburger menu icon animation
 * Transforms to X on open
 *
 * @param {HTMLElement} topLine - Top line element
 * @param {HTMLElement} middleLine - Middle line element
 * @param {HTMLElement} bottomLine - Bottom line element
 */
export const createHamburgerTimeline = (topLine, middleLine, bottomLine) => {
  const tl = gsap.timeline({ paused: true });

  if (prefersReducedMotion()) {
    return tl;
  }

  tl
    // Middle line fades out
    .to(middleLine, {
      opacity: 0,
      duration: DURATION.instant,
    })

    // Top line rotates to form X
    .to(
      topLine,
      {
        rotation: 45,
        y: 8,
        duration: DURATION.fast,
        ease: EASE.smooth,
      },
      0
    )

    // Bottom line rotates opposite
    .to(
      bottomLine,
      {
        rotation: -45,
        y: -8,
        duration: DURATION.fast,
        ease: EASE.smooth,
      },
      0
    );

  return tl;
};

// ═══════════════════════════════════════════════════════════════════════════
// LINK HOVER ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates GSAP-controlled underline hover effect
 * Premium sliding underline animation
 *
 * @param {HTMLElement} link - Link element
 * @param {HTMLElement} underline - Underline element (pseudo or real)
 */
export const createUnderlineHover = (link, underline) => {
  const tl = gsap.timeline({ paused: true });

  if (prefersReducedMotion()) {
    return tl;
  }

  tl.fromTo(
    underline,
    {
      scaleX: 0,
      transformOrigin: "left center",
    },
    {
      scaleX: 1,
      duration: DURATION.fast,
      ease: EASE.smooth,
    }
  );

  link.addEventListener("mouseenter", () => tl.play());
  link.addEventListener("mouseleave", () => tl.reverse());

  return tl;
};

/**
 * Creates animated underline that follows cursor direction
 * Underline enters from the side cursor comes from
 *
 * @param {HTMLElement} link - Link element with underline
 */
export const createDirectionalUnderline = (link) => {
  // Create underline element if not exists
  let underline = link.querySelector(".nav-underline");
  if (!underline) {
    underline = document.createElement("span");
    underline.className = "nav-underline";
    underline.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: currentColor;
      transform: scaleX(0);
    `;
    link.style.position = "relative";
    link.appendChild(underline);
  }

  if (prefersReducedMotion()) return null;

  link.addEventListener("mouseenter", (e) => {
    const rect = link.getBoundingClientRect();
    const fromLeft = e.clientX < rect.left + rect.width / 2;

    gsap.fromTo(
      underline,
      {
        scaleX: 0,
        transformOrigin: fromLeft ? "left center" : "right center",
      },
      {
        scaleX: 1,
        duration: DURATION.fast,
        ease: EASE.smooth,
      }
    );
  });

  link.addEventListener("mouseleave", (e) => {
    const rect = link.getBoundingClientRect();
    const toLeft = e.clientX < rect.left + rect.width / 2;

    gsap.to(underline, {
      scaleX: 0,
      transformOrigin: toLeft ? "left center" : "right center",
      duration: DURATION.fast,
      ease: EASE.smooth,
    });
  });

  return underline;
};

// ═══════════════════════════════════════════════════════════════════════════
// DROPDOWN ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates premium dropdown animation
 * Fade + scale + blur effect
 *
 * @param {HTMLElement} dropdown - Dropdown container
 * @param {NodeList|Array} items - Dropdown items
 */
export const createDropdownTimeline = (dropdown, items) => {
  const tl = gsap.timeline({ paused: true });

  if (prefersReducedMotion()) {
    tl.set(dropdown, { display: "block", opacity: 1 });
    return tl;
  }

  gsap.set(dropdown, { display: "none", opacity: 0 });

  tl.set(dropdown, { display: "block" }).fromTo(
    dropdown,
    {
      opacity: 0,
      y: -10,
      scale: 0.95,
      filter: "blur(10px)",
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: DURATION.fast,
      ease: EASE.smooth,
    }
  );

  if (items && items.length > 0) {
    tl.fromTo(
      items,
      {
        opacity: 0,
        x: -10,
      },
      {
        opacity: 1,
        x: 0,
        duration: DURATION.fast,
        stagger: 0.03,
        ease: EASE.smooth,
      },
      "-=0.1"
    );
  }

  return tl;
};

// ═══════════════════════════════════════════════════════════════════════════
// SEARCH BAR ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates expanding search bar animation
 *
 * @param {HTMLElement} container - Search container
 * @param {HTMLElement} input - Search input
 * @param {HTMLElement} icon - Search icon
 */
export const createSearchExpandTimeline = (container, input, icon) => {
  const tl = gsap.timeline({ paused: true });

  if (prefersReducedMotion()) {
    return tl;
  }

  tl.to(container, {
    width: "300px",
    duration: DURATION.normal,
    ease: EASE.smooth,
  })
    .to(
      icon,
      {
        x: -10,
        duration: DURATION.fast,
        ease: EASE.smooth,
      },
      0
    )
    .fromTo(
      input,
      {
        opacity: 0,
        width: 0,
      },
      {
        opacity: 1,
        width: "auto",
        duration: DURATION.normal,
        ease: EASE.smooth,
      },
      0
    );

  return tl;
};
