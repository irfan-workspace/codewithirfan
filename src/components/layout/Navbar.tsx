import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/certificates", label: "Certificates" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-strong shadow-lg shadow-background/50"
          : "bg-transparent border-b border-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-[72px]">
        <Link to="/" className="text-xl font-bold text-gradient" aria-label="Home">
          MI
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`relative text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                pathname === l.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
              aria-current={pathname === l.to ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/resume"
            className="ml-2 text-sm font-semibold px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:shadow-md hover:shadow-primary/20 hover:-translate-y-px transition-all duration-200"
            aria-current={pathname === "/resume" ? "page" : undefined}
          >
            Resume
          </Link>
        </div>
        <button
          className="md:hidden text-foreground p-2 rounded-lg hover:bg-secondary transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass-strong border-t border-border/30 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`text-sm font-medium py-3 px-4 rounded-lg transition-colors ${
                    pathname === l.to
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                  aria-current={pathname === l.to ? "page" : undefined}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/resume"
                className={`text-sm font-medium py-3 px-4 rounded-lg transition-colors ${
                  pathname === "/resume"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                Resume
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
