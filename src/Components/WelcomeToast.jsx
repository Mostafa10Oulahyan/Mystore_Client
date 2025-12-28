import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideWelcome } from "../redux/slice/AuthSlice";

const WelcomeToast = () => {
  const dispatch = useDispatch();
  const showWelcomeMessage = useSelector(
    (state) => state.Auth.showWelcomeMessage
  );
  const welcomeMessageType = useSelector(
    (state) => state.Auth.welcomeMessageType
  );
  const user = useSelector((state) => state.Auth.user);

  useEffect(() => {
    if (showWelcomeMessage) {
      const timer = setTimeout(() => {
        dispatch(hideWelcome());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showWelcomeMessage, dispatch]);

  if (!showWelcomeMessage) return null;

  const isNewUser = welcomeMessageType === "register";
  const firstName = user?.firstName || user?.name?.split(" ")[0] || "there";

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
                {isNewUser ? "Welcome aboard! 🎉" : "Welcome back! 👋"}
              </h3>
              <p className="text-blue-100 text-sm">
                {isNewUser
                  ? "Account created successfully"
                  : "You're now logged in"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-gray-700">
            {isNewUser ? (
              <>
                Hey{" "}
                <span className="font-semibold text-blue-600">{firstName}</span>
                ! Your account is ready. Start exploring our amazing collection!
              </>
            ) : (
              <>
                Good to see you again,{" "}
                <span className="font-semibold text-blue-600">{firstName}</span>
                ! Ready to continue shopping?
              </>
            )}
          </p>

          {/* Quick Tips for new users */}
          {isNewUser && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              <span>Tip: Visit your profile to customize your experience!</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-blue-600 animate-progress-bar"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => dispatch(hideWelcome())}
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
