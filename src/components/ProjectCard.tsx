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

export default function ProjectCard({
  slug,
  title,
  tagline,
  category,
  stack,
  is_featured,
  cover_image_url,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link
        to={`/projects/${slug}`}
        className="group block gradient-border rounded-2xl overflow-hidden hover:glow transition-all duration-500 hover:-translate-y-1"
      >
        {/* Image */}
        <div className="aspect-video bg-secondary relative overflow-hidden">
          {cover_image_url ? (
            <img
              src={cover_image_url}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
              <span className="text-5xl font-extrabold text-primary/20 group-hover:text-primary/30 transition-colors duration-500">
                {title[0]}
              </span>
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {/* Featured badge */}
          {is_featured && (
            <span className="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full bg-primary/90 text-primary-foreground backdrop-blur-sm">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono text-primary/80 uppercase tracking-wider">
              {category}
            </span>
            <ArrowUpRight
              size={16}
              className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
            />
          </div>
          <h3 className="text-lg font-bold mb-1.5 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tagline}</p>
          <div className="flex flex-wrap gap-1.5">
            {(stack as string[]).slice(0, 4).map((s) => (
              <span
                key={s}
                className="text-xs px-2.5 py-1 rounded-md bg-secondary/80 text-secondary-foreground"
              >
                {s}
              </span>
            ))}
            {stack.length > 4 && (
              <span className="text-xs px-2.5 py-1 rounded-md bg-secondary/60 text-muted-foreground">
                +{stack.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
