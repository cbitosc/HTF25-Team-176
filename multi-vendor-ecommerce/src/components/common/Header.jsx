import React, { useState } from "react";
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#2E003E] text-[#FFF5E1] shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide text-[#FFD60A] hover:text-[#E85D04] transition-all"
        >
          PetMart
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 font-medium">
          <Link
            to="/"
            className="hover:text-[#E85D04] transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="hover:text-[#E85D04] transition-colors duration-200"
          >
            Shop
          </Link>
          <Link
            to="/orders"
            className="hover:text-[#E85D04] transition-colors duration-200"
          >
            Orders
          </Link>
          <Link
            to="/contact"
            className="hover:text-[#E85D04] transition-colors duration-200"
          >
            Contact
          </Link>
        </nav>

        {/* Icons */}
        <div className="hidden md:flex items-center gap-6 text-xl">
          <Link
            to="/wishlist"
            className="hover:text-[#FFD60A] transition-all"
            title="Wishlist"
          >
            <FiHeart />
          </Link>
          <Link
            to="/cart"
            className="hover:text-[#FFD60A] transition-all"
            title="Cart"
          >
            <FiShoppingCart />
          </Link>
          <Link
            to="/profile"
            className="hover:text-[#FFD60A] transition-all"
            title="Profile"
          >
            <FiUser />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-[#FFD60A]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#FFF5E1] text-[#2E003E] border-t-2 border-[#E85D04]">
          <nav className="flex flex-col space-y-4 p-4 font-medium">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="hover:text-[#E85D04]"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className="hover:text-[#E85D04]"
            >
              Shop
            </Link>
            <Link
              to="/orders"
              onClick={() => setMenuOpen(false)}
              className="hover:text-[#E85D04]"
            >
              Orders
            </Link>
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="hover:text-[#E85D04]"
            >
              Contact
            </Link>

            <div className="flex justify-around text-xl pt-2 border-t border-[#E85D04]/40">
              <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
                <FiHeart className="hover:text-[#E85D04]" />
              </Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)}>
                <FiShoppingCart className="hover:text-[#E85D04]" />
              </Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                <FiUser className="hover:text-[#E85D04]" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
