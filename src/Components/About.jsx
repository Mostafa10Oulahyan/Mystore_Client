import React, { useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../Footer/Footer";
import { EASE, DURATION } from "../animations/config";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  // Animation refs
  const heroRef = useRef(null);
  const quoteRef = useRef(null);
  const imageRef = useRef(null);
  const sectionsRef = useRef(null);
  const instagramRef = useRef(null);
  const featuresRef = useRef(null);

  const instagramImages = [
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=300&fit=crop",
  ];

  // Premium GSAP Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Quote Section Animation
      if (heroRef.current) {
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        });

        heroTl
          .from(quoteRef.current, {
            opacity: 0,
            x: -60,
            duration: DURATION.slow,
            ease: EASE.smooth,
          })
          .from(
            imageRef.current,
            {
              opacity: 0,
              x: 60,
              scale: 0.9,
              duration: DURATION.slow,
              ease: EASE.smooth,
            },
            "-=0.4"
          );
      }

      // Alternating sections with scroll-based reveal
      if (sectionsRef.current) {
        const contentBlocks =
          sectionsRef.current.querySelectorAll(".content-block");

        contentBlocks.forEach((block, index) => {
          const isEven = index % 2 === 0;
          const image = block.querySelector(".block-image");
          const text = block.querySelector(".block-text");

          const sectionTl = gsap.timeline({
            scrollTrigger: {
              trigger: block,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play none none reverse",
            },
          });

          sectionTl
            .from(image, {
              opacity: 0,
              x: isEven ? -80 : 80,
              scale: 0.95,
              duration: DURATION.slow,
              ease: EASE.cinematic,
            })
            .from(
              text,
              {
                opacity: 0,
                x: isEven ? 80 : -80,
                duration: DURATION.slow,
                ease: EASE.cinematic,
              },
              "-=0.5"
            )
            .from(
              text.querySelectorAll("h3, p"),
              {
                opacity: 0,
                y: 30,
                stagger: 0.1,
                duration: DURATION.normal,
                ease: EASE.smooth,
              },
              "-=0.3"
            );
        });
      }

      // Instagram section waterfall animation
      if (instagramRef.current) {
        const images = instagramRef.current.querySelectorAll(".instagram-item");

        gsap.from(images, {
          scrollTrigger: {
            trigger: instagramRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 60,
          scale: 0.9,
          stagger: {
            each: 0.1,
            from: "center",
          },
          duration: DURATION.normal,
          ease: EASE.smooth,
        });
      }

      // Features section stagger animation
      if (featuresRef.current) {
        const features = featuresRef.current.querySelectorAll(".feature-item");

        gsap.from(features, {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 50,
          scale: 0.9,
          stagger: 0.15,
          duration: DURATION.normal,
          ease: EASE.smooth,
        });

        // Add floating animation to feature icons
        features.forEach((feature) => {
          const icon = feature.querySelector(".feature-icon");
          if (icon) {
            gsap.to(icon, {
              y: -8,
              duration: 2,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          }
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white text-center py-2 text-sm">
        <span>Free Shipping on Orders over $140!</span>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-700">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-blue-600 font-medium">About us</span>
        </div>
      </div>

      {/* Hero Quote Section */}
      <section ref={heroRef} className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-slate-100 to-blue-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          {/* Quote Content */}
          <div ref={quoteRef} className="flex-1">
            <div className="text-blue-600 text-6xl mb-4">"</div>
            <p className="text-gray-700 italic text-lg leading-relaxed mb-6">
              We are glad to present you our most perfect Shopify theme, which
              supports Sections Everywhere, very high metric scores by google
              page speed insight. This is the most mobile-oriented theme that
              will be convenient on any of your devices.
            </p>
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold text-gray-800">Jack Donovan</p>
              </div>
              <div className="text-2xl font-script text-gray-600 italic">
                <svg
                  width="80"
                  height="40"
                  viewBox="0 0 80 40"
                  className="opacity-70"
                >
                  <path
                    d="M5 30 Q15 10, 25 25 T45 20 Q55 15, 65 25 L75 15"
                    stroke="#374151"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div ref={imageRef} className="flex-1 flex justify-center">
            <div className="relative img-zoom-container">
              <img
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=450&fit=crop"
                alt="Fashion Model"
                className="rounded-lg shadow-lg object-cover w-80 h-96 transition-transform duration-700"
              />
              {/* Chat bubble */}
              <div className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A Few Words About Us Section */}
      <section ref={sectionsRef} className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            A Few Words About Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Make your best moments more stylish with our latest designs of
            clothing.
          </p>
        </div>

        {/* Why Choose Us - Image Left, Text Right */}
        <div className="content-block grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="block-image relative img-zoom-container overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&h=600&fit=crop"
              alt="Fashion Model"
              className="shadow-lg w-full h-auto object-cover transition-transform duration-700"
            />
          </div>
          <div className="block-text">
            <h3 className="text-2xl font-bold mb-6">Why choose us ?</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We believe fashion should be accessible, sustainable, and uniquely
              yours. Our carefully curated collection features premium quality
              fabrics, timeless designs, and contemporary styles that empower
              you to express your individuality. Every piece is selected with
              attention to detail, ensuring you receive clothing that not only
              looks great but feels amazing to wear.
            </p>
            <p className="text-gray-600 leading-relaxed">
              With over a decade of experience in fashion retail, we've built
              lasting relationships with trusted suppliers worldwide. Our
              commitment to ethical sourcing and fair trade practices means you
              can shop with confidence, knowing that your purchase supports
              sustainable fashion and responsible manufacturing.
            </p>
          </div>
        </div>

        {/* Trusted Online Shopping - Text Left, Image Right */}
        <div className="content-block grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="block-text order-2 md:order-1">
            <h3 className="text-2xl font-bold mb-6">Trusted online shopping</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Your security and satisfaction are our top priorities. We use
              industry-leading encryption technology to protect your personal
              information and payment details. Our secure checkout process is
              certified by trusted payment providers, ensuring every transaction
              is safe and protected. Shop with peace of mind knowing your data
              is always secure with us.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We offer hassle-free returns within 7 days and provide 24/7
              customer support to assist you with any questions. Our dedicated
              team is committed to ensuring your shopping experience is seamless
              from browsing to delivery.
            </p>
          </div>
          <div className="block-image order-1 md:order-2 img-zoom-container overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=400&fit=crop"
              alt="Online Shopping Laptop"
              className="shadow-lg w-full h-auto object-cover transition-transform duration-700"
            />
          </div>
        </div>

        {/* Another Section - Image Left, Text Right */}
        <div className="content-block grid md:grid-cols-2 gap-12 items-center">
          <div className="block-image img-zoom-container overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=600&fit=crop"
              alt="Fashion Model"
              className="shadow-lg w-full h-auto object-cover transition-transform duration-700"
            />
          </div>
          <div className="block-text">
            <h3 className="text-2xl font-bold mb-6">
              Fast & reliable delivery
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Experience lightning-fast delivery with our efficient logistics
              network. We partner with leading shipping carriers to ensure your
              orders arrive on time, every time. Track your package in real-time
              and receive instant notifications at every step of the delivery
              process. Free shipping is available on all orders over $140.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our packaging is eco-friendly and designed to protect your items
              during transit. We take pride in delivering your fashion finds in
              perfect condition, ready to wear the moment they arrive at your
              doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section ref={instagramRef} className="py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="text-gray-400">
              <svg
                className="inline-block w-6 h-6 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </span>
            <span className="text-blue-600">#iconic_fashion</span> On Instagram
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Preaseu dolor malesuada ligula pulvinar commodo maecenas
          </p>
        </div>

        <div className="flex overflow-hidden">
          {instagramImages.map((image, index) => (
            <div
              key={index}
              className="instagram-item flex-1 aspect-square overflow-hidden group relative cursor-pointer"
            >
              <img
                src={image}
                alt={`Instagram ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white transform group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="max-w-7xl mx-auto py-16 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="feature-item text-center">
            <div className="feature-icon flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0066ff"
                  strokeWidth="1.5"
                >
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
            </div>
            <h4 className="font-bold mb-2">Free Shipping</h4>
            <p className="text-sm text-gray-500">
              Free shipping on all US order or order above $100
            </p>
          </div>

          <div className="feature-item text-center">
            <div className="feature-icon flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0066ff"
                  strokeWidth="1.5"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
            </div>
            <h4 className="font-bold mb-2">Payment Secure</h4>
            <p className="text-sm text-gray-500">
              We ensure secure payment with PEV
            </p>
          </div>

          <div className="feature-item text-center">
            <div className="feature-icon flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0066ff"
                  strokeWidth="1.5"
                >
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
              </div>
            </div>
            <h4 className="font-bold mb-2">7 Days Return</h4>
            <p className="text-sm text-gray-500">
              Simply return it within 7 days for an exchange
            </p>
          </div>

          <div className="feature-item text-center">
            <div className="feature-icon flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0066ff"
                  strokeWidth="1.5"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
            </div>
            <h4 className="font-bold mb-2">Support 24/7</h4>
            <p className="text-sm text-gray-500">
              Contact us 24 hours a day, 7 days a week
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
