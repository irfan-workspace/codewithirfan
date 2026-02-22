import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Briefcase, Code2, Trophy, Rocket, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "@/components/ProjectCard";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  const [settings, setSettings] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);

  const roles = ["Full-Stack Developer", "AI Builder", "React Engineer", "Problem Solver"];
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
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("is_published", true).then(({ count }) => setTotalProjects(count || 0));
    supabase.from("skills").select("*").order("order_index").then(({ data }) => setSkills(data || []));
  }, []);

  const metrics = [
    { icon: Code2, value: `${totalProjects}+`, label: "Projects Built" },
    { icon: Rocket, value: "3+", label: "Platforms Shipped" },
    { icon: Trophy, value: "5+", label: "Hackathons" },
    { icon: Briefcase, value: "2+", label: "Years Experience" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center section-padding overflow-hidden">
        {/* Animated orb background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="hero-orb-1 absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="hero-orb-2 absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-400/15 blur-[100px]" />
          <div className="hero-orb-3 absolute top-1/2 right-1/4 w-[280px] h-[280px] rounded-full bg-primary/10 blur-[80px]" />
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

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 leading-[1.08]">
              Hi, I'm{" "}
              <span className="text-gradient">{settings?.name || "Mohd Irfan"}</span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl md:text-2xl text-muted-foreground mb-3 font-light h-9"
            >
              <span>{currentRole.slice(0, charIndex)}</span>
              <span className="inline-block w-[2px] h-6 bg-primary ml-0.5 align-middle animate-pulse" />
            </motion.p>

            {settings?.hero_text && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-base md:text-lg text-muted-foreground/80 mb-8 max-w-2xl leading-relaxed"
              >
                {settings.hero_text}
              </motion.p>
            )}
            {!settings?.hero_text && settings?.summary && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-base md:text-lg text-muted-foreground/80 mb-8 max-w-2xl leading-relaxed"
              >
                {settings.summary}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                View Projects <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-primary/30 text-primary font-semibold hover:bg-primary/10 transition-colors"
              >
                <Mail size={16} /> Hire Me
              </Link>
              <Link
                to="/resume"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
              >
                Resume
              </Link>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="flex justify-center mt-16">
            <ChevronDown size={24} className="text-muted-foreground animate-bounce" aria-hidden="true" />
          </motion.div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-12 md:py-16 px-4 md:px-8 border-y border-border/50">
        <div className="container mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {metrics.map((m) => (
              <motion.div key={m.label} variants={fadeUp} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                  <m.icon size={22} />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-foreground">{m.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{m.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Problem → Solution → Impact */}
      <section className="section-padding">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-sm font-mono text-primary mb-2">What I Do</p>
            <h2 className="text-3xl md:text-4xl font-bold">Building Solutions That Matter</h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                step: "01",
                title: "Identify the Problem",
                desc: "I analyze complex challenges and break them into solvable components — from scalable platforms to AI-driven tools.",
              },
              {
                step: "02",
                title: "Engineer the Solution",
                desc: "Using modern tech stacks (React, Node, AI/ML), I build production-grade applications with clean architecture.",
              },
              {
                step: "03",
                title: "Deliver Real Impact",
                desc: "From ALGORYTHRA to LMS platforms, every project ships with measurable outcomes and real user value.",
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                className="glass rounded-xl p-6 group hover:glow transition-all duration-300"
              >
                <span className="text-4xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold mt-3 mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
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
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
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
              {skills.map((sg) => (
                <motion.div
                  key={sg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass rounded-xl p-6 hover:glow transition-all duration-300"
                >
                  <h3 className="text-sm font-semibold text-primary mb-4">{sg.group_name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(sg.items) ? sg.items : []).map((s: string) => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                        {s}
                      </span>
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
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-10 md:p-16 text-center glow"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Build Something Great</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Looking for a developer who ships production-ready solutions? Let's connect.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                Get in Touch <ArrowRight size={16} />
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
              >
                View Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
