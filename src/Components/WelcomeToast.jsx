import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const WelcomeToast = () => {
  const { user, isSignedIn } = useUser();
  const [show, setShow] = useState(false);
  const [wasSignedIn, setWasSignedIn] = useState(false);

  useEffect(() => {
    // Show toast when user transitions from signed-out to signed-in
    if (isSignedIn && !wasSignedIn) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 4000);
      return () => clearTimeout(timer);
    }
    setWasSignedIn(!!isSignedIn);
  }, [isSignedIn]);

  if (!show || !isSignedIn) return null;

  const firstName = user?.firstName || "there";

  return (
    <div className="fixed top-24 right-4 z-[200] animate-slide-in-toast">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-w-sm">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Success Icon */}
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                Welcome back! 👋
              </h3>
              <p className="text-blue-100 text-sm">
                You're now logged in
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-gray-700">
            Good to see you again,{" "}
            <span className="font-semibold text-blue-600">{firstName}</span>
            ! Ready to continue shopping?
          </p>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-blue-600 animate-progress-bar"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-3 p-1 text-white/70 hover:text-white transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WelcomeToast;
