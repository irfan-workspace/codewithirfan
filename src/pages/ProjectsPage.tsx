import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "@/components/ProjectCard";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    supabase.from("projects").select("*").eq("is_published", true).order("created_at", { ascending: false }).then(({ data }) => setProjects(data || []));
  }, []);

  const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];
  const filtered = filter === "All" ? projects : projects.filter(p => p.category === filter);

  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-mono text-primary mb-2">Portfolio</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Projects</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl">A collection of projects I've worked on.</p>
        </motion.div>
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} className={`text-sm px-4 py-1.5 rounded-full font-medium transition-colors ${filter === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <ProjectCard key={p.id} slug={p.slug} title={p.title} tagline={p.tagline} category={p.category} stack={p.stack || []} is_featured={p.is_featured} cover_image_url={p.cover_image_url} />
          ))}
        </div>
        {filtered.length === 0 && <p className="text-muted-foreground text-center py-20">No projects found.</p>}
      </div>
    </section>
  );
}
