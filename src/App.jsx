import { Routes, Route, useLocation } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./Navbar/Navbar";
import Home from "./Components/Home";
import About from "./Components/About";
import Collection from "./Components/Collection";
import ProductDetail from "./Components/ProductDetail";
import Panier from "./Components/Panier";
import Contact from "./Components/Contact";
import ScrollToTop from "./Components/ScrollToTop";
import Favourite from "./Components/Favourite";
import NotFound from "./Components/NotFound";
import Account from "./Components/Account";
import TrackOrder from "./Components/TrackOrder";
import WelcomeToast from "./Components/WelcomeToast";
import { useUserSync } from "./hooks/useUserSync";
import { EASE, DURATION } from "./animations/config";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const location = useLocation();
  const mainRef = useRef(null);
  const scrollProgressRef = useRef(null);

  // Sync user data with Supabase and hydrate contexts on sign-in
  useUserSync();

  // Scroll progress indicator
  useLayoutEffect(() => {
    if (!scrollProgressRef.current) return;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;

      gsap.to(scrollProgressRef.current, {
        scaleX: progress,
        duration: 0.1,
        ease: "none",
      });
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  // Page transition animation on route change
  useLayoutEffect(() => {
    if (!mainRef.current) return;

    // Quick entrance animation for new page
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mainRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.normal,
          ease: EASE.smooth,
        }
      );
    });

    // Refresh ScrollTrigger on route change
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div
        ref={scrollProgressRef}
        className="scroll-progress"
        style={{ transform: "scaleX(0)" }}
      />

      <ScrollToTop />
      <Navbar />
      <main ref={mainRef} className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/favourite" element={<Favourite />} />
          <Route path="/account" element={<Account />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Welcome Toast */}
      <WelcomeToast />
    </>
  );
}

export default App;
