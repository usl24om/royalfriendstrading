import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { FiUser, FiLogOut } from "react-icons/fi";
import logo from "../assets/logo.jpg";
import Auth from "../Components/LoginSignup";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleToggle = () => setIsOpen(!isOpen);

  const handleScroll = () => {
    const sections = ["home", "services", "about", "projects", "footer"];
    const scrollPosition = window.scrollY + 110;

    let foundSection = "home";
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;
        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          foundSection = section;
          break;
        }
      }
    }

    const footerElement = document.getElementById("footer");
    if (footerElement && scrollPosition >= footerElement.offsetTop) {
      foundSection = "footer";
    }

    setActiveSection(foundSection);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserMenu && !e.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  const handleScrollTo = (targetId) => {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    const header = document.querySelector("header");
    const offset = header ? header.offsetHeight + 20 : 100;
    const scrollToPosition =
      targetElement.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: scrollToPosition,
      behavior: "smooth",
    });

    setActiveSection(targetId);
    if (isOpen) handleToggle();
  };

  const handleSignOut = async () => {
    setShowUserMenu(false);
    await signOut();
    navigate("/");
  };

  const navButtonClass = (sectionId) =>
    `px-4 py-2 rounded transition-all ${
      activeSection === sectionId
        ? "bg-heroBg text-white"
        : "text-black bg-transparent"
    } hover:bg-heroBg hover:text-white`;

  const displayName = user?.user_metadata?.full_name || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const navLinks = (
    <ul className="flex font-medium flex-col md:flex-row lg:space-x-8 sm:space-x-4 space-y-2 md:space-y-0 p-4 md:p-0 pt-2 items-center">
      {["home", "services", "about", "footer"].map((section) => (
        <li key={section}>
          <button
            onClick={() => handleScrollTo(section)}
            className={navButtonClass(section)}
          >
            {section === "footer"
              ? "Contact Us"
              : section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        </li>
      ))}
      <li>
        {loading ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        ) : user ? (
          <div className="relative user-menu-container">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-heroBg text-white hover:opacity-90 transition-opacity"
              aria-label="User menu"
            >
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                {initials}
              </span>
              <span className="text-sm font-medium hidden lg:block max-w-[120px] truncate">
                {displayName}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (isOpen) handleToggle();
                    navigate("/profile");
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <FiUser className="text-heroBg" />
                  My Profile
                </button>
                <div className="border-t border-gray-100" />
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <FiLogOut />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => {
              if (isOpen) handleToggle();
              setShowAuth(true);
            }}
            className={navButtonClass("signup")}
          >
            Signup
          </button>
        )}
      </li>
    </ul>
  );

  return (
    <header className="text-black py-6 px-4 fixed top-0 left-0 right-0 z-10 bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center h-full">
        <a href="/">
          <img src={logo} alt="Logo" className="h-16 w-auto" />
        </a>

        <div className="hidden md:flex flex-grow justify-center">
          <nav>{navLinks}</nav>
        </div>

        <div className="md:hidden block">
          <button
            onClick={handleToggle}
            className="text-black focus:outline-none"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <IoMdClose className="size-6" />
            ) : (
              <IoMdMenu className="size-6" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="absolute top-full left-0 w-full bg-white z-20 md:hidden shadow-md">
          {navLinks}
        </nav>
      )}

      {showAuth && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAuth(false);
          }}
        >
          <div className="bg-white rounded-xl p-8 w-full max-w-md relative mx-4 shadow-2xl">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close auth modal"
            >
              <IoMdClose className="size-5" />
            </button>
            <Auth
              onClose={() => setShowAuth(false)}
              onSuccess={() => setShowAuth(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
