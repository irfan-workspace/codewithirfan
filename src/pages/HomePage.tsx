import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "@/components/ProjectCard";

/* ── Minimal fade animation ── */
const fade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ── Counter ── */
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = Math.max(1, Math.floor(value / 60));
    const id = setInterval(() => {
      n += step;
      if (n >= value) { setCount(value); clearInterval(id); }
      else setCount(n);
    }, 16);
    return () => clearInterval(id);
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Page ── */
export default function HomePage() {
  const [settings, setSettings] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    supabase.from("settings").select("*").limit(1).single().then(({ data }) => setSettings(data));
    supabase.from("projects").select("*").eq("is_published", true).eq("is_featured", true)
      .order("created_at", { ascending: false }).limit(3)
      .then(({ data }) => setProjects(data || []));
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("is_published", true)
      .then(({ count }) => setProjectCount(count || 0));
    supabase.from("skills").select("*").order("order_index")
      .then(({ data }) => setSkills(data || []));
  }, []);

  const metrics = [
    { value: projectCount || 3, suffix: "+", label: "Projects" },
    { value: 3, suffix: "+", label: "Platforms" },
    { value: 5, suffix: "+", label: "Hackathons" },
    { value: 2, suffix: "+", label: "Yrs Experience" },
  ];

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="min-h-[90vh] flex items-center">
        <div className="container mx-auto px-6 md:px-8 py-20">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {settings?.availability_status || "Available for work"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              {settings?.name || "Mohd Irfan"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4 max-w-xl"
            >
              {settings?.title || "Full-Stack Developer"}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-base text-muted-foreground/80 leading-relaxed mb-10 max-w-lg"
            >
              {settings?.hero_text || settings?.summary || "Building production software that solves real problems."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
              >
                View Work <ArrowRight size={15} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
              >
                <Mail size={15} /> Get in Touch
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── METRICS ─── */}
      <section className="border-y border-border">
        <div className="container mx-auto px-6 md:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((m) => (
              <motion.div key={m.label} variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <p className="text-3xl md:text-4xl font-bold tracking-tight">
                  <Counter value={m.value} suffix={m.suffix} />
                </p>
                <p className="text-sm text-muted-foreground mt-1">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROJECTS ─── */}
      {projects.length > 0 && (
        <section className="section-padding">
          <div className="container mx-auto px-6 md:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Selected Work</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Projects</h2>
              </div>
              <Link
                to="/projects"
                className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                All projects <ArrowUpRight size={14} />
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
            <div className="sm:hidden mt-8">
              <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                View all projects <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── APPROACH ─── */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mb-14">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Approach</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How I build software</h2>
            <p className="text-muted-foreground leading-relaxed">
              A clear process from understanding the problem to shipping production-ready code with measurable results.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
            {[
              { num: "01", title: "Understand", desc: "I start with the problem — not the tech. Research, user needs, and clear requirements come before any code." },
              { num: "02", title: "Build", desc: "Clean architecture with React, Node.js, and modern tooling. Every decision optimized for maintainability and scale." },
              { num: "03", title: "Ship", desc: "Production deployment with real users, measurable outcomes, and documented impact. Not just code — results." },
            ].map((item) => (
              <motion.div
                key={item.num}
                variants={fade}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="bg-card p-8 md:p-10"
              >
                <span className="text-xs font-mono text-muted-foreground">{item.num}</span>
                <h3 className="text-lg font-semibold mt-3 mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SKILLS ─── */}
      {skills.length > 0 && (
        <section className="section-padding">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-3xl mb-14">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Stack</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Technologies I work with</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {skills.map((sg) => (
                <motion.div key={sg.id} variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }}>
                  <h3 className="text-sm font-medium text-foreground mb-4">{sg.group_name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(sg.items) ? sg.items : []).map((s: string) => (
                      <span
                        key={s}
                        className="text-xs px-3 py-1.5 rounded-md bg-secondary text-muted-foreground"
                      >
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

      {/* ─── CTA ─── */}
      <section className="section-padding">
        <div className="container mx-auto px-6 md:px-8">
          <motion.div
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-card border border-border rounded-xl p-10 md:p-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          >
            <div className="max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                Let's work together
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Available for freelance projects and full-time roles.
                I'd love to hear about what you're building.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Start a conversation <ArrowRight size={15} />
              </Link>
              <Link
                to="/resume"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
              >
                View Resume
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
