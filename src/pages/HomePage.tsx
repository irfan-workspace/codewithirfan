import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "@/components/ProjectCard";

export default function HomePage() {
  const [settings, setSettings] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("settings").select("*").limit(1).single().then(({ data }) => setSettings(data));
    supabase.from("projects").select("*").eq("is_published", true).eq("is_featured", true).order("created_at", { ascending: false }).limit(3).then(({ data }) => setProjects(data || []));
    supabase.from("skills").select("*").order("order_index").then(({ data }) => setSkills(data || []));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="min-h-[90vh] flex items-center section-padding">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              {settings?.availability_status || "Open to work"}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Hi, I'm <span className="text-gradient">{settings?.name || "Mohd Irfan"}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-light">
              {settings?.title || "Full-Stack Developer"}
            </p>
            {settings?.summary && (
              <p className="text-lg text-muted-foreground/80 mb-8 max-w-2xl leading-relaxed">
                {settings.summary}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              <Link to="/projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                View Projects <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors">
                Get in Touch
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex justify-center mt-16">
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
