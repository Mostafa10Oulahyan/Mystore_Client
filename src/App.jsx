import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
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
import Register from "./Components/Register";
import Login from "./Components/Login";
import EditProfile from "./Components/EditProfile";
import WelcomeToast from "./Components/WelcomeToast";

function App() {
  const showRegister = useSelector((state) => state.Auth.showRegister);
  const showLogin = useSelector((state) => state.Auth.showLogin);
  const showEditProfile = useSelector((state) => state.Auth.showEditProfile);

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/favourite" element={<Favourite />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Auth Modals */}
      {showRegister && <Register />}
      {showLogin && <Login />}
      {showEditProfile && <EditProfile />}

      {/* Welcome Toast */}
      <WelcomeToast />
    </>
  );
}

export default App;
