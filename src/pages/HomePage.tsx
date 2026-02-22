import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Briefcase,
  Code2,
  Trophy,
  Rocket,
  Mail,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "@/components/ProjectCard";

/* ──────────────────────── animation variants ──────────────────────── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

/* ──────────────────────── AnimatedCounter ──────────────────────── */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 1200;
    const step = Math.max(1, Math.floor(end / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ──────────────────────── SectionHeader ──────────────────────── */
function SectionHeader({
  label,
  title,
  subtitle,
  align = "left",
}: {
  label: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={align === "center" ? "text-center mb-16" : "mb-14"}
    >
      <div className={`flex items-center gap-2 mb-3 ${align === "center" ? "justify-center" : ""}`}>
        <div className="h-px w-8 bg-primary/50" />
        <span className="text-xs font-mono text-primary uppercase tracking-widest">{label}</span>
        <div className="h-px w-8 bg-primary/50" />
      </div>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed text-base md:text-lg mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/* ──────────────────────── HomePage ──────────────────────── */
export default function HomePage() {
  const [settings, setSettings] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);

  /* typing animation */
  const roles = ["Full-Stack Developer", "AI Builder", "React Engineer", "Problem Solver"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentRole = roles[roleIndex];

  useEffect(() => {
    const speed = isDeleting ? 40 : 80;
    const pause =
      !isDeleting && charIndex === currentRole.length
        ? 1800
        : isDeleting && charIndex === 0
          ? 400
          : speed;
    const timer = setTimeout(() => {
      if (!isDeleting && charIndex === currentRole.length) setIsDeleting(true);
      else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setRoleIndex((p) => (p + 1) % roles.length);
      } else setCharIndex((p) => p + (isDeleting ? -1 : 1));
    }, pause);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentRole, roles.length]);

  /* data */
  useEffect(() => {
    supabase
      .from("settings")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => setSettings(data));
    supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setProjects(data || []));
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true)
      .then(({ count }) => setTotalProjects(count || 0));
    supabase
      .from("skills")
      .select("*")
      .order("order_index")
      .then(({ data }) => setSkills(data || []));
  }, []);

  /* parallax */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const metrics = [
    { icon: Code2, value: totalProjects || 3, suffix: "+", label: "Projects Built", color: "from-primary/20 to-primary/5" },
    { icon: Rocket, value: 3, suffix: "+", label: "Platforms Shipped", color: "from-primary/15 to-primary/5" },
    { icon: Trophy, value: 5, suffix: "+", label: "Hackathons", color: "from-primary/20 to-primary/5" },
    { icon: Briefcase, value: 2, suffix: "+", label: "Years Building", color: "from-primary/15 to-primary/5" },
  ];

  const process = [
    {
      icon: Target,
      step: "01",
      title: "Identify the Problem",
      desc: "I analyze complex challenges, research user pain points, and define clear requirements before writing a single line of code.",
    },
    {
      icon: Zap,
      step: "02",
      title: "Engineer the Solution",
      desc: "Using React, Node.js, and AI/ML, I architect scalable systems with clean code, thorough testing, and production-grade infrastructure.",
    },
    {
      icon: TrendingUp,
      step: "03",
      title: "Deliver Real Impact",
      desc: "Every project — from ALGORYTHRA to LMS platforms — ships with measurable outcomes, real users, and documented results.",
    },
  ];

  return (
    <>
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Background layers */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Orbs */}
          <div className="hero-orb-1 absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-primary/15 blur-[140px]" />
          <div className="hero-orb-2 absolute -bottom-40 -left-40 w-[550px] h-[550px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="hero-orb-3 absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-primary/8 blur-[100px]" />
          {/* Grid */}
          <div
            className="hero-grid absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, hsl(160 84% 39% / 0.4) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* Gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background" />
        </motion.div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 pt-24 pb-12">
          <div className="max-w-4xl">
            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-strong text-sm font-medium mb-8"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <span className="text-primary">{settings?.availability_status || "Open to work"}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter leading-[1.05] mb-5"
            >
              <span className="text-foreground">Hi, I'm </span>
              <span className="text-gradient">{settings?.name || "Mohd Irfan"}</span>
            </motion.h1>

            {/* Typing animation */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="flex items-center gap-3 mb-5"
            >
              <Sparkles size={18} className="text-primary/60" />
              <p className="text-xl md:text-2xl text-muted-foreground font-light">
                <span>{currentRole.slice(0, charIndex)}</span>
                <span className="inline-block w-[2px] h-6 bg-primary ml-0.5 align-middle animate-pulse" />
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-base md:text-lg text-muted-foreground/80 mb-10 max-w-xl leading-relaxed"
            >
              {settings?.hero_text || settings?.summary || "I build things for the web."}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                View Projects
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-primary/30 text-primary font-semibold hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Mail size={16} /> Hire Me
              </Link>
              <Link
                to="/resume"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-foreground/80 font-medium hover:bg-secondary hover:border-border/80 transition-all duration-300 hover:-translate-y-0.5"
              >
                Resume
              </Link>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs text-muted-foreground/50 uppercase tracking-widest">Scroll</span>
              <ChevronDown size={16} className="text-muted-foreground/50" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ METRICS STRIP ═══════════════════════ */}
      <section className="relative section-padding-sm border-y border-border/30">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          >
            {metrics.map((m) => (
              <motion.div
                key={m.label}
                variants={fadeUp}
                className="metric-card text-center p-6 rounded-2xl glass hover:glow-sm transition-all duration-300 group"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${m.color} text-primary mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <m.icon size={24} strokeWidth={1.5} />
                </div>
                <p className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                  <AnimatedCounter value={m.value} suffix={m.suffix} />
                </p>
                <p className="text-sm text-muted-foreground mt-1.5 font-medium">{m.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ PROCESS ═══════════════════════ */}
      <section className="section-padding relative">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader
            label="How I Work"
            title="From Problem to Production"
            subtitle="A systematic approach to building software that solves real problems and delivers measurable value."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid md:grid-cols-3 gap-6 md:gap-8"
          >
            {process.map((item) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                className="group relative gradient-border rounded-2xl p-8 hover:glow transition-all duration-500"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                    <item.icon size={22} strokeWidth={1.5} />
                  </div>
                  <span className="text-5xl font-extrabold text-primary/10 group-hover:text-primary/25 transition-colors duration-300 leading-none">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-line mx-auto max-w-4xl" />

      {/* ═══════════════════════ FEATURED PROJECTS ═══════════════════════ */}
      {projects.length > 0 && (
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-end justify-between mb-14">
              <SectionHeader label="Featured Work" title="Selected Projects" />
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <Link
                  to="/projects"
                  className="group flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4 shrink-0"
                >
                  View all projects
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </motion.div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {projects.map((p, i) => (
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

      {/* Divider */}
      <div className="section-line mx-auto max-w-4xl" />

      {/* ═══════════════════════ SKILLS ═══════════════════════ */}
      {skills.length > 0 && (
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-8">
            <SectionHeader
              label="Tech Stack"
              title="Skills & Technologies"
              subtitle="Tools and technologies I use daily to build production-grade applications."
            />
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {skills.map((sg) => (
                <motion.div
                  key={sg.id}
                  variants={fadeUp}
                  className="gradient-border rounded-2xl p-6 hover:glow-sm transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
                      {sg.group_name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(sg.items) ? sg.items : []).map((s: string) => (
                      <span key={s} className="skill-tag">
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════ CTA ═══════════════════════ */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative noise glass rounded-3xl p-12 md:p-20 text-center overflow-hidden"
          >
            {/* Background accent */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
              >
                <Sparkles size={14} />
                Let's collaborate
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight">
                Ready to Build Something{" "}
                <span className="text-gradient">Great?</span>
              </h2>
              <p className="text-muted-foreground mb-10 max-w-lg mx-auto text-base md:text-lg leading-relaxed">
                I'm currently available for freelance work and full-time opportunities.
                Let's turn your ideas into production-ready solutions.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Get in Touch
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-foreground font-medium hover:bg-secondary transition-all duration-300 hover:-translate-y-0.5"
                >
                  View Projects
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
