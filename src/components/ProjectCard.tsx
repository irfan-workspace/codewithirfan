import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  stack: string[];
  is_featured: boolean;
  cover_image_url?: string;
}

export default function ProjectCard({ slug, title, tagline, category, stack, is_featured, cover_image_url }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/projects/${slug}`} className="group block glass rounded-xl overflow-hidden hover:glow transition-shadow duration-300">
        <div className="aspect-video bg-secondary relative overflow-hidden">
          {cover_image_url ? (
            <img src={cover_image_url} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="text-4xl font-bold text-primary/30">{title[0]}</span>
            </div>
          )}
          {is_featured && (
            <span className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full bg-primary text-primary-foreground">Featured</span>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-primary">{category}</span>
            <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{tagline}</p>
          <div className="flex flex-wrap gap-1.5">
            {(stack as string[]).slice(0, 4).map(s => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{s}</span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
