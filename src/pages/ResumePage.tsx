import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { FileText, ExternalLink } from "lucide-react";

export default function ResumePage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("settings")
      .select("resume_url,name")
      .limit(1)
      .single()
      .then(({ data }) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  return (
    <section className="section-padding">
      <div className="container mx-auto max-w-2xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <FileText size={48} className="mx-auto text-primary mb-6" />
          <h1 className="text-4xl font-bold mb-4">Resume</h1>
          <p className="text-muted-foreground mb-8">
            Download or view my resume to learn more about my qualifications and experience.
          </p>
          {loading ? (
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          ) : settings?.resume_url ? (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={settings.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                <ExternalLink size={16} /> View Resume
              </a>
              <a
                href={settings.resume_url}
                download
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
              >
                <FileText size={16} /> Download PDF
              </a>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Resume will be available soon.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
