import { useState } from "react";
import { Menu } from "../../icons/react/menu";
import CartButton from "../cart/CartButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${isOpen ? "bg-white shadow-md border-b border-white/80" : "bg-white/95 md:bg-white/90 md:backdrop-blur-sm shadow-sm border-b border-white/60"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div className="shrink-0">
            <a
              href="/"
              className="text-2xl font-bold tracking-tight text-textDark hover:opacity-80 transition"
            >
              ماسة <span className="text-textLight font-light">فاشين</span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 space-x-reverse">
              <a href="/#home" className="text-textDark hover:text-black hover:bg-white/50 px-3 py-2 rounded-xl text-sm font-medium transition">
                الرئيسية
              </a>
              <a href="#products" className="text-textLight hover:text-black hover:bg-white/50 px-3 py-2 rounded-xl text-sm font-medium transition">
                منتجاتنا
              </a>
              <a href="#testimonials" className="text-textLight hover:text-black hover:bg-white/50 px-3 py-2 rounded-xl text-sm font-medium transition">
                آراء العملاء
              </a>
            </div>
          </div>

          {/* CTA Button + Cart */}
          <div className="hidden md:flex items-center gap-3">
            <CartButton standalone />
            <a
              href="#products"
              className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              تسوق الآن
            </a>
          </div>

          {/* Mobile Menu Button + Cart */}
          <div className="md:hidden flex items-center gap-2">
            <CartButton standalone />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex items-center justify-center cursor-pointer rounded-md text-gray-700 hover:text-black transition"
            >
                <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-white/80 absolute w-full">
          <div className="px-4 pt-4 pb-6 space-y-2 text-center">
            <a
              href="/"
              onClick={() => setIsOpen(false)}
              className="block text-gray-900 px-3 py-2 rounded-md text-base font-medium hover:bg-white/40"
            >
              الرئيسية
            </a>
            <a
              href="/#products"
              onClick={() => setIsOpen(false)}
              className="block text-gray-900 hover:text-black px-3 py-2 rounded-md text-base font-medium hover:bg-white/40"
            >
              منتجاتنا
            </a>
            <a
              href="/#testimonials"
              onClick={() => setIsOpen(false)}
              className="block text-gray-900 hover:text-black px-3 py-2 rounded-md text-base font-medium hover:bg-white/40"
            >
              آراء العملاء
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
