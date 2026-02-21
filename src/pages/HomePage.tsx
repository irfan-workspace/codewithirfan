import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "@/components/ProjectCard";

export default function HomePage() {
  const [settings, setSettings] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);

  const roles = ["Full-Stack Developer", "React Developer", "Node.js Engineer", "UI/UX Enthusiast", "Problem Solver"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentRole = roles[roleIndex];

  useEffect(() => {
    const speed = isDeleting ? 40 : 80;
    const pause = !isDeleting && charIndex === currentRole.length ? 1800 : isDeleting && charIndex === 0 ? 400 : speed;

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex === currentRole.length) {
        setIsDeleting(true);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      } else {
        setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
      }
    }, pause);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentRole, roles.length]);

  useEffect(() => {
    supabase.from("settings").select("*").limit(1).single().then(({ data }) => setSettings(data));
    supabase.from("projects").select("*").eq("is_published", true).eq("is_featured", true).order("created_at", { ascending: false }).limit(3).then(({ data }) => setProjects(data || []));
    supabase.from("skills").select("*").order("order_index").then(({ data }) => setSkills(data || []));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center section-padding overflow-hidden">
        {/* Animated orb background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Orb 1 — large green, top-right */}
          <div className="hero-orb-1 absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
          {/* Orb 2 — medium teal, bottom-left */}
          <div className="hero-orb-2 absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-400/15 blur-[100px]" />
          {/* Orb 3 — small accent, center-right */}
          <div className="hero-orb-3 absolute top-1/2 right-1/4 w-[280px] h-[280px] rounded-full bg-primary/10 blur-[80px]" />
          {/* Subtle dot grid */}
          <div
            className="hero-grid absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, hsl(160 84% 39% / 0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              {settings?.availability_status || "Open to work"}
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Hi, I'm{" "}
              <span className="text-gradient">{settings?.name || "Mohd Irfan"}</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl md:text-2xl text-muted-foreground mb-4 font-light h-9"
            >
              <span>{currentRole.slice(0, charIndex)}</span>
              <span className="inline-block w-[2px] h-6 bg-primary ml-0.5 align-middle animate-pulse" />
            </motion.p>
            {settings?.summary && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="text-lg text-muted-foreground/80 mb-10 max-w-2xl leading-relaxed"
              >
                {settings.summary}
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                View Projects <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
              >
                Get in Touch
              </Link>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="flex justify-center mt-16">
            <ChevronDown size={24} className="text-muted-foreground animate-bounce" aria-hidden="true" />
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-sm font-mono text-primary mb-2">Featured Work</p>
                <h2 className="text-3xl md:text-4xl font-bold">Selected Projects</h2>
              </div>
              <Link to="/projects" className="text-sm text-primary hover:underline flex items-center gap-1 shrink-0">
                View all <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(p => (
                <ProjectCard
                  key={p.id}
                  slug={p.slug}
                  title={p.title}
                  tagline={p.tagline || ""}
                  category={p.category || ""}
                  stack={Array.isArray(p.stack) ? p.stack : []}
                  is_featured={p.is_featured || false}
                  cover_image_url={p.cover_image_url}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="section-padding">
          <div className="container mx-auto">
            <p className="text-sm font-mono text-primary mb-2">Expertise</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Skills & Technologies</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map(sg => (
                <motion.div key={sg.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-primary mb-4">{sg.group_name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(sg.items) ? sg.items : []).map((s: string) => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{s}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's work together</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Have a project in mind? I'd love to hear about it.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              Get in Touch <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
