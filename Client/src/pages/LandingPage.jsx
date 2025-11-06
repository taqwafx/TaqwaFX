import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import toast from "react-hot-toast";


const plans = [
  {
    name: "Silver Plan",
    roi: "5%",
    duration: "12 Months",
    minimum: "$1,000",
    highlighted: false,
  },
  {
    name: "Gold Plan",
    roi: "10%",
    duration: "20 Months",
    minimum: "$1,000",
    highlighted: true,
  },
  {
    name: "Platinum Plan",
    roi: "12%",
    duration: "24 Months",
    minimum: "$1,000",
    highlighted: false,
  },
];

const LandingPage = () => {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#home"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              About
            </a>
            <a
              href="#plans"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Plans
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Contact
            </a>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                toast.error("Please Contact the Admin to Invest.", "Info")
              }
              className="hidden sm:block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition hover:cursor-pointer"
            >
              Get Started
            </button>
            <button className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition hover:cursor-pointer">
              <Link to="/auth/login/">Login</Link>
            </button>
          </div>
        </nav>
      </header>

      <section
        id="home"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Invest in your Future
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Grow your wealth with premium investment plans and secure your
              financial future.
            </p>
            <button
              onClick={() =>
                toast.error("Please Contact the Admin to Invest.", "Info")
              }
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-lg cursor-pointer"
            >
              Invest Now
            </button>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <img
              src="./professional-man-with-laptop-smiling.jpg"
              alt="Professional investor with laptop"
              className="w-full max-w-md rounded-lg"
            />
          </div>
        </div>
      </section>

      <section
        id="about"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
      >
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">
              About RB Invest
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We are committed to providing our clients with the best investment
              opportunities, helping them achieve their financial goals with
              confidence.
            </p>
          </div>

          {/* Right Mission Box */}
          <div className="bg-blue-50 rounded-lg p-8 space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To help our clients build wealth and secure their financial future
              through diversified investment strategies.
            </p>
          </div>
        </div>
      </section>

      <section
        id="plans"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
      >
        <div className="space-y-6 mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Investment Plans</h2>
          <p className="text-lg text-gray-600">
            Choose the investment plan that suits your goals and start growing
            your wealth today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-lg p-8 space-y-6 transition ${
                plan.highlighted
                  ? "bg-blue-50 border-2 border-blue-100"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.roi}
                    </span>
                    <span className="text-gray-600 ml-2">Monthly ROI</span>
                  </p>
                </div>

                <div>
                  <p className="text-gray-900 font-semibold">{plan.duration}</p>
                </div>

                <div>
                  <p className="text-gray-900 font-semibold">
                    Min. {plan.minimum}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  toast.error("Please Contact the Admin to Invest.", "Info")
                }
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      <section
        id="contact"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
      >
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Get in Touch</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Have questions? Reach out to us and we'll be happy to assist you.
            </p>
          </div>

          {/* Right Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">✉</span>
              </div>
              <p className="text-lg text-gray-900 font-medium">
                info@rbinvest.com
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📞</span>
              </div>
              <p className="text-lg text-gray-900 font-medium">
                +1 234 562.650
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 RB Invest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage