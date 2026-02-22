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

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-gradient" aria-label="Home">MI</Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === l.to ? "text-primary" : "text-muted-foreground"}`}
              aria-current={pathname === l.to ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/resume"
            className="text-sm font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            aria-current={pathname === "/resume" ? "page" : undefined}
          >
            Resume
          </Link>
        </div>
        <button
          className="md:hidden text-foreground p-1 rounded-md hover:bg-secondary transition-colors"
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
            className="md:hidden glass border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {links.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`text-sm font-medium py-2.5 px-3 rounded-md transition-colors ${pathname === l.to ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
                  aria-current={pathname === l.to ? "page" : undefined}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/resume"
                className={`text-sm font-medium py-2.5 px-3 rounded-md transition-colors ${pathname === "/resume" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
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
