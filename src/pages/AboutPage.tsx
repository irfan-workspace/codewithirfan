import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function AboutPage() {
  const [settings, setSettings] = useState<any>(null);
  const [experience, setExperience] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("settings").select("*").limit(1).single().then(({ data }) => setSettings(data));
    supabase.from("experience").select("*").eq("is_published", true).order("order_index").then(({ data }) => setExperience(data || []));
    supabase.from("skills").select("*").order("order_index").then(({ data }) => setSkills(data || []));
    supabase.from("testimonials").select("*").eq("is_published", true).order("order_index").then(({ data }) => setTestimonials(data || []));
  }, []);

  return (
    <section className="section-padding">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-mono text-primary mb-2">About Me</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{settings?.name || "Mohd Irfan"}</h1>
          {settings?.title && (
            <p className="text-lg text-primary font-medium mb-3">{settings.title}</p>
          )}
          {settings?.summary && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-16 max-w-2xl">{settings.summary}</p>
          )}
        </motion.div>

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">Experience</h2>
            <div className="space-y-4">
              {experience.map(exp => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="glass rounded-xl p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                    <div>
                      <h3 className="font-semibold">{exp.role}</h3>
                      <p className="text-primary text-sm mt-0.5">{exp.company}</p>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono whitespace-nowrap shrink-0">
                      {formatDate(exp.start_date)} — {exp.end_date ? formatDate(exp.end_date) : "Present"}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed mt-3">{exp.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">Skills</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {skills.map(sg => (
                <div key={sg.id} className="glass rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-primary mb-3">{sg.group_name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(sg.items) ? sg.items : []).map((s: string) => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-8">Testimonials</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map(t => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass rounded-xl p-6 flex flex-col justify-between gap-4"
                >
                  <p className="text-muted-foreground text-sm leading-relaxed italic">"{t.message}"</p>
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[t.title, t.source].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
