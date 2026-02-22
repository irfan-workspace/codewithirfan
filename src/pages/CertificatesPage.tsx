import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Award, X, Calendar, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_id: string | null;
  skills: string[];
  image_url: string | null;
  verify_url: string | null;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("certificates")
      .select("*")
      .eq("is_published", true)
      .order("order_index")
      .then(({ data }) => {
        setCertificates(
          (data || []).map((c: any) => ({
            ...c,
            skills: Array.isArray(c.skills) ? c.skills : [],
          }))
        );
        setLoading(false);
      });
  }, []);

  return (
    <>
      <section className="section-padding">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Award className="text-primary" size={20} />
              <p className="text-sm font-mono text-primary">Verified Credentials</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Certificates & Achievements
            </h1>
            <p className="text-muted-foreground max-w-2xl mb-12">
              Professional certifications and achievements that validate my expertise and continuous learning journey.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass rounded-xl h-72 animate-pulse" />
              ))}
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Award size={48} className="mx-auto mb-4 opacity-30" />
              <p>No certificates published yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onClick={() => setSelected(cert)}
                  className="group glass rounded-xl overflow-hidden cursor-pointer hover:glow transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  <div className="aspect-[16/10] bg-secondary relative overflow-hidden">
                    {cert.image_url ? (
                      <img
                        src={cert.image_url}
                        alt={cert.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <Award size={48} className="text-primary/30" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-xs font-mono text-primary mb-1.5">{cert.issuer}</p>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {cert.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <Calendar size={12} />
                      <span>
                        {new Date(cert.issue_date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {cert.skills.slice(0, 4).map((s) => (
                          <span
                            key={s}
                            className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                          >
                            {s}
                          </span>
                        ))}
                        {cert.skills.length > 4 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            +{cert.skills.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl glass border-border p-0 overflow-hidden">
          <DialogTitle className="sr-only">
            {selected?.title ?? "Certificate details"}
          </DialogTitle>
          {selected && (
            <div>
              {selected.image_url && (
                <div className="aspect-video bg-secondary">
                  <img
                    src={selected.image_url}
                    alt={selected.title}
                    className="w-full h-full object-contain bg-background/50"
                  />
                </div>
              )}
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm font-mono text-primary mb-1">{selected.issuer}</p>
                  <h2 className="text-2xl font-bold">{selected.title}</h2>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(selected.issue_date).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  {selected.credential_id && (
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={14} />
                      ID: {selected.credential_id}
                    </span>
                  )}
                </div>
                {selected.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selected.skills.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                {selected.verify_url && (
                  <a
                    href={selected.verify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity text-sm"
                  >
                    Verify Credential <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
