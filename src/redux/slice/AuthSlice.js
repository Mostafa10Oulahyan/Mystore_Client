import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage
const loadUserFromStorage = () => {
  try {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      return JSON.parse(savedUser);
    }
  } catch (error) {
    console.error("Error loading user from localStorage:", error);
  }
  return null;
};

const savedUser = loadUserFromStorage();

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    showRegister: false,
    showLogin: false,
    showEditProfile: false,
    showWelcomeMessage: false,
    welcomeMessageType: null, // 'register' or 'login'
    isAuthenticated: !!savedUser,
    user: savedUser,
  },
  reducers: {
    openRegister: (state) => {
      state.showRegister = true;
      state.showLogin = false;
    },
    closeRegister: (state) => {
      state.showRegister = false;
    },
    openLogin: (state) => {
      state.showLogin = true;
      state.showRegister = false;
    },
    closeLogin: (state) => {
      state.showLogin = false;
    },
    openEditProfile: (state) => {
      state.showEditProfile = true;
    },
    closeEditProfile: (state) => {
      state.showEditProfile = false;
    },
    showWelcome: (state, action) => {
      state.showWelcomeMessage = true;
      state.welcomeMessageType = action.payload; // 'register' or 'login'
    },
    hideWelcome: (state) => {
      state.showWelcomeMessage = false;
      state.welcomeMessageType = null;
    },
    switchToLogin: (state) => {
      state.showRegister = false;
      state.showLogin = true;
    },
    switchToRegister: (state) => {
      state.showLogin = false;
      state.showRegister = true;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.showLogin = false;
      state.showRegister = false;
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      state.showEditProfile = false;
      // Update localStorage
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    updateProfilePicture: (state, action) => {
      state.user = { ...state.user, profilePicture: action.payload };
      // Update localStorage
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      // Remove from localStorage
      localStorage.removeItem("user");
    },
  },
});

export const {
  openRegister,
  closeRegister,
  openLogin,
  closeLogin,
  openEditProfile,
  closeEditProfile,
  showWelcome,
  hideWelcome,
  switchToLogin,
  switchToRegister,
  setAuthenticated,
  updateUser,
  updateProfilePicture,
  logout,
} = AuthSlice.actions;

export default AuthSlice.reducer;
