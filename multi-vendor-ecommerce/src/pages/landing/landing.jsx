import React from "react";
import Header from "../../components/common/Header"; // adjust path if Header is under src/components/common

const Landing = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Fish Tank",
      price: 2499,
      image: "https://via.placeholder.com/200x200",
    },
    {
      id: 2,
      name: "Pet Food Bowl",
      price: 499,
      image: "https://via.placeholder.com/200x200",
    },
    {
      id: 3,
      name: "Organic Pet Shampoo",
      price: 899,
      image: "https://via.placeholder.com/200x200",
    },
  ];

  return (
    <div className="bg-[#2E003E] min-h-screen text-[#FFF5E1]">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="text-center py-20 px-6 md:px-12">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-[#FFD60A]">
          Welcome to PetMart 🐾
        </h1>
        <p className="text-lg md:text-xl text-[#FFF5E1]/90 mb-8 max-w-2xl mx-auto">
          Your one-stop shop for all pet care essentials. From fish tanks to
          grooming kits — everything your furry (or finned) friend deserves!
        </p>
        <button className="bg-[#E85D04] hover:bg-[#FFD60A] text-[#FFF5E1] hover:text-[#2E003E] px-8 py-3 rounded-full font-semibold text-lg transition-all">
          Shop Now
        </button>
      </section>

      {/* Featured Products */}
      <section className="bg-[#FFF5E1] text-[#2E003E] py-16 px-6 md:px-12 rounded-t-[3rem]">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#386641]">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[#FFF5E1] border border-[#E85D04]/30 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover rounded-t-2xl"
              />
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">
                  {product.name}
                </h3>
                <p className="text-[#386641] font-medium mb-4">
                  ₹{product.price}
                </p>
                <button className="bg-[#E85D04] text-[#FFF5E1] hover:bg-[#FFD60A] hover:text-[#2E003E] px-5 py-2 rounded-full font-semibold transition-all">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2E003E] py-6 mt-16 text-center border-t border-[#E85D04]/40">
        <p className="text-[#FFF5E1]/80">
          © {new Date().getFullYear()} PetMart — All Rights Reserved 🐾
        </p>
      </footer>
    </div>
  );
};

export default Landing;
