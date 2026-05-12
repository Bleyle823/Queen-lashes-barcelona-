import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/our-story", label: "Our Story" },
  { to: "/treatments", label: "Treatments" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-pink-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Queenlashes Barcelona logo" className="w-16 h-16 object-contain sm:w-[4.5rem] sm:h-[4.5rem]" />
          <div className="leading-tight hidden sm:block">
            <div className="font-display text-base tracking-widest text-ink">QUEENLASHES</div>
            <div className="font-display text-xs tracking-[0.3em] text-ink/70">BARCELONA</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                `font-display tracking-widest text-base transition-colors relative group ${isActive ? "text-ink" : "text-ink/80 hover:text-ink"}`
              }
            >
              {i.label.toUpperCase()}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ink transition-all group-hover:w-full" />
            </NavLink>
          ))}
        </nav>

        {/* Booking CTA */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="hidden md:inline-flex"
        >
          <Link to="/booking">
            BOOKING
          </Link>
        </Button>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav 
            className="md:hidden bg-pink-bar border-t border-ink/10 px-6 py-6 flex flex-col gap-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((i, index) => (
              <motion.div
                key={i.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={i.to}
                  onClick={() => setOpen(false)}
                  className="font-display tracking-widest text-ink hover:text-ink/80 transition-colors"
                >
                  {i.label.toUpperCase()}
                </NavLink>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.1 }}
            >
              <Button
                asChild
                variant="primary"
                size="sm"
                className="w-full"
              >
                <Link
                  to="/booking"
                  onClick={() => setOpen(false)}
                >
                  BOOKING
                </Link>
              </Button>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
