import React from "react";

const Cart = () => {
  const cartItems = [
    {
      id: 1,
      name: "Aquarium Fish Food",
      price: 499,
      quantity: 2,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Pet Care Kit",
      price: 899,
      quantity: 1,
      image: "https://via.placeholder.com/100",
    },
  ];

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#2E003E] text-[#FFF5E1] py-10 px-4 md:px-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#FFD60A]">
        Your Cart 🛍️
      </h1>

      {/* Cart Container */}
      <div className="max-w-5xl mx-auto bg-[#FFF5E1] text-[#2E003E] rounded-2xl shadow-xl overflow-hidden">
        {cartItems.length === 0 ? (
          <p className="text-center py-10 text-lg">Your cart is empty 😢</p>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Left: Cart Items */}
            <div className="flex-1 p-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between mb-6 border-b border-[#E85D04]/30 pb-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl border-2 border-[#E85D04]"
                    />
                    <div>
                      <h2 className="text-lg font-semibold">{item.name}</h2>
                      <p className="text-sm text-[#386641]">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-[#E85D04]">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            {/* Right: Summary */}
            <div className="md:w-1/3 bg-[#FFF5E1]/80 p-6 border-t md:border-t-0 md:border-l border-[#E85D04]/30">
              <h2 className="text-2xl font-bold mb-4 text-[#386641]">
                Order Summary
              </h2>
              <div className="flex justify-between mb-2 text-sm">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span>Shipping</span>
                <span>₹50</span>
              </div>
              <div className="flex justify-between font-semibold text-lg text-[#E85D04] mb-6">
                <span>Total</span>
                <span>₹{total + 50}</span>
              </div>

              <button className="w-full py-3 bg-[#E85D04] text-[#FFF5E1] font-bold rounded-xl hover:bg-[#FFD60A] hover:text-[#2E003E] transition-all">
                Proceed to Checkout
              </button>

              <button className="w-full mt-4 py-3 border border-[#E85D04] text-[#E85D04] rounded-xl hover:bg-[#E85D04] hover:text-[#FFF5E1] transition-all">
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
